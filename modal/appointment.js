const { getConnection } = require('../db');
const db = require('../db');
const constants = require('../constant')

async function addTimeSlots(data){
    const connection = await getConnection();
    try {
      const sqlData = [data.appointment_id,data.appointment_date, data.appointment_time, data.status];
      console.log("SQL DATA",sqlData);
      const [rows] = await connection.execute('INSERT INTO appointment_time_slots (appointment_id,appointment_date, appointment_time, status) VALUES (?, ?, ?, ?)', sqlData)
      return rows;
    } finally {
      connection.release();
    }
}

async function getTimeSlots (data){
    const connection = await getConnection();
    try {
        const sqlData = [data.appointment_date, data.appointment_time, data.status];
        console.log("SQL DATA",sqlData);
        // Construct the SQL query
        const [rows] = await connection.execute('SELECT * FROM appointment_time_slots WHERE appointment_date = ? AND appointment_time = ? AND status = ?',sqlData);
        console.log("My ROW",rows)
        return rows;
      } finally {
        connection.release();
      }
}

async function deleteAppointment (data){
    const connection = await getConnection();
    try {
        const sqlData = [data.appointment_date, data.appointment_time, data.status];
        console.log("SQL DATA",sqlData);
        // Construct the SQL query
        const [rows] = await connection.execute('DELETE FROM appointment_time_slots WHERE appointment_date = ? AND appointment_time = ? AND status = ?',sqlData);
        if(rows && rows.affectedRows){
            return rows.affectedRows
        }else{
            return null;
        }
      } finally {
        connection.release();
      }
}

async function addAppointment (data,slotDetail){
    const connection = await getConnection();
    try {
      await connection.beginTransaction();
      const sqlData = [data.patient_id,data.patient_name, data.patient_number, data.patient_email,
                        slotDetail[0].appointment_id];
      console.log("SQL DATA",sqlData);
      const [rows] = await connection.execute('INSERT INTO appointment (patient_id,patient_name, patient_number, patient_email, appointment_slot_id) VALUES (?, ?, ?, ?, ?)', sqlData)
      
      // Here Updating appointment
      const [rows2] = await connection.execute(
        'UPDATE appointment_time_slots SET status = ? WHERE appointment_id = ?',
        [constants.STATUS.booked, slotDetail[0].appointment_id]
      );
      await connection.commit(); 
      return rows;

    }catch (error){
        await connection.rollback();
        throw error;
    } finally {
      connection.release();
    }
}

async function updateAppointment (data,slotDetail){
    const connection = await getConnection();
    try {
      await connection.beginTransaction();
      const sqlData = [data.patient_id,slotDetail[0].appointment_id];
        // Fetch detail of appointment of that patient.
      const [appointment_detail] = await connection.execute('SELECT * FROM appointment WHERE patient_id = ?',[data.patient_id]);
      console.log("Appointment detail",appointment_detail);
      console.log("SQL DATA",sqlData);

       // Updaet previos appointment to available.
      const [rows1] = await connection.execute(
        'UPDATE appointment_time_slots SET status = ? WHERE appointment_id = ?',
        [constants.STATUS.available, appointment_detail[0].appointment_slot_id]
      );
       // Update reference key in appoitnment to book.
      console.log("SLOT DETAIL"+slotDetail[0].appointment_id +"Patient ID"+data.patient_id)
      const [rows] = await connection.execute('UPDATE appointment SET appointment_slot_id = ? WHERE patient_id = ?',
      [slotDetail[0].appointment_id ,data.patient_id])
      
      // Update new appoitnment to booked at appointment slot table.
      const [rows2] = await connection.execute(
        'UPDATE appointment_time_slots SET status = ? WHERE appointment_id = ?',
        [constants.STATUS.booked, slotDetail[0].appointment_id]
      );
      await connection.commit(); 
      return rows2;

    }catch (error){
        console.log("Error is",error);
        await connection.rollback();
        throw error;
    } finally {
      connection.release();
    } 
}

async function getPatientDetails (data){
    const connection = await getConnection();
    try {
        const sqlData = [data.patient_id];
        console.log("SQL DATA",sqlData);
        // Construct the SQL query
        const [rows] = await connection.execute('SELECT * FROM appointment WHERE patient_id = ?',sqlData);
        return rows;
      } finally {
        connection.release();
      }
}

async function deleteSchdeuleAppointment (data){
    const connection = await getConnection();
    try {
        await connection.beginTransaction();
        const sqlData = [data.patient_id];
        console.log("SQL DATA",sqlData);
        // Construct the SQL query
        const [row] = await connection.execute(
            'UPDATE appointment_time_slots SET status = ? WHERE appointment_id = ?',
            [constants.STATUS.available, data.appointment_slot_id]
        ); 
        console.log("My update row",row)
        const [rows] = await connection.execute('DELETE FROM appointment WHERE patient_id = ?',sqlData);
        console.log("My update from updae",rows);
        await connection.commit(); 
        return rows
      }catch (error){
        console.log("Error is",error);
        await connection.rollback();
        throw error;
      }  finally {
        connection.release();
      }
}

  module.exports = {
    addTimeSlots,
    getTimeSlots,
    deleteAppointment,
    addAppointment,
    updateAppointment,
    getPatientDetails,
    deleteSchdeuleAppointment
  };
  