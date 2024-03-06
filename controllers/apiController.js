// Controller logic for API routes
const jwt = require('jsonwebtoken');
const appointment = require('../modal/appointment');
const { v4: uuidv4 } = require('uuid');
const constants = require('../constant')

exports.addTimeSlots = async (req,res) => { 
   if(!req.body.appointment_date || !req.body.appointment_time){
    return res.status(400).send({message:"ADD appointment Date, Time"});
   }
    try{
        const appointment_time_slots = {}
        appointment_time_slots.appointment_date = req.body.appointment_date
        appointment_time_slots.appointment_time = req.body.appointment_time
        appointment_time_slots.status = 'Available'
        appointment_time_slots.appointment_id = uuidv4();
        // Check Entered Time slot is preexit or not.
        const isSlotExist = await appointment.getTimeSlots(appointment_time_slots);
        if(Array.isArray(isSlotExist) && isSlotExist.length > 0){
          return res.status(409).send({ message:"Appointment Already Exist in Table"});
        }else{
          const added_Appointment = await appointment.addTimeSlots(appointment_time_slots);
          return res.send({ message:added_Appointment});
        }
       
    }catch (error){
        console.log("Error is",error)
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};

exports.deleteTimeSlots = async(req,res) =>{
  try{
    if(!req.body.appointment_date  || !req.body.appointment_time){
      return res.status(400).send({message:"Need Appointment Date and time"});
    }
    const appointment_time_slots = {}
    appointment_time_slots.appointment_date = req.body.appointment_date
    appointment_time_slots.appointment_time = req.body.appointment_time
    appointment_time_slots.status = 'Available'
    const deleteAppointment = await appointment.deleteAppointment(appointment_time_slots)
    if(deleteAppointment > 0 ){
      return res.send({ message:`Succesfully delete ${deleteAppointment} appointment`});
    }else{
      return res.send({ message:"Something went wrong unable to delete"});
    }
  }catch (error){
    console.log("Error is",error)
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
}
}

exports.schdeuleAppointment = async (req,res) => {
  const data = req.body;
  if(!data.appointment_date || !data.appointment_time){
    return res.status(400).send({message:"ADD appointment Date, Time"});
   }
    try{
        const appointment_time_slots = {}
        appointment_time_slots.appointment_date = data.appointment_date
        appointment_time_slots.appointment_time = data.appointment_time
        appointment_time_slots.status = constants.STATUS.available

        const isSlotExist = await appointment.getTimeSlots(appointment_time_slots);
        //return res.send({ message:isSlotExist});
        
        console.log("IS SLOT EXIST",isSlotExist);

        // Check Entered Time slot is preexit or not.
        if(Array.isArray(isSlotExist) && isSlotExist.length > 0){
          const appointments = {}
          appointments.patient_id = uuidv4(),
          appointments.patient_name = data.patient_name
          appointments.patient_number = data.patient_number
          appointments.patient_email = data.patient_email
          const added_Appointment = await appointment.addAppointment(appointments,isSlotExist);
          return res.send({ message:added_Appointment});
        }else{
          return res.status(409).send({ message:"No Appointment available for given date and time please check with other date time"});
        }
       
    }catch (error){
        console.log("Error is",error)
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
}
 // I am working here.
exports.rescheduleAppointment = async (req,res) => {
  const data = req.body;
  if(!data.appointment_date || !data.appointment_time ){
    return res.status(400).send({message:"ADD appointment Date, Time"});
   }

  if(!data.patient_id){
    return res.status(400).send({message:"Give patient ID to find appointment"});
  }
  try{
      const appointment_time_slots = {}
      appointment_time_slots.appointment_date = data.appointment_date
      appointment_time_slots.appointment_time = data.appointment_time
      appointment_time_slots.status = constants.STATUS.available

      const isSlotExist = await appointment.getTimeSlots(appointment_time_slots);
      //return res.send({ message:isSlotExist});
      
      console.log("IS SLOT EXIST",isSlotExist);

      // Check Entered Time slot is preexit or not.
      if(Array.isArray(isSlotExist) && isSlotExist.length > 0){

       // Get UUID for given information.
       // const previous_booked_appointment  = await appointment.addAppointment(appointments,isSlotExist);

        const appointments = {}
        appointments.patient_id = data.patient_id
        const added_Appointment = await appointment.updateAppointment(appointments,isSlotExist);
        return res.send({ message:added_Appointment});

      }else{
        return res.status(409).send({ message:"No Appointment available for given date and time please check with other date time"});
      }
       
    }catch (error){
        console.log("Error is",error)
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
}

exports.deleteAppointment = async (req,res) => {
  const data = req.body;
  if(!data.patient_id){
    return res.status(400).send({message:"Give patient ID to delete Appointment"});
  }
  try {    
      const pateint_details = await appointment.getPatientDetails(data);
      console.log("Patient details",pateint_details)
      // Check Entered Time slot is preexit or not.
      if(Array.isArray(pateint_details) && pateint_details.length > 0){

        const appointments = pateint_details[0]
        const deleted_Appointment = await appointment.deleteSchdeuleAppointment(appointments);
        return res.send({ message:deleted_Appointment});

      }else{
        return res.status(409).send({ message:"No Appointment patient details available for given patient id"});
      }
       
    }catch (error){
        console.log("Error is",error)
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
}
