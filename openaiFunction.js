async function processPitchEmailWithGPTModel(
    initialPrompt,
    text,
    tools,
    toolChoice,
    temperature,
    top_p,
  ) {
    try {
      const request = {
        model: "gpt-4-1106-preview",
        messages: [
          {
            role: "user",
            content: `${initialPrompt} ${text}`,
          },
        ],
        temperature,
        top_p,
      };
  
      request.tools = tools;
      request.tool_choice = toolChoice;

      console.log("GPT REQUEST", JSON.stringify(request));

      const response = await callGPTApi(request, token);
      console.log(
        `function: processPitchEmailWithGPTModel:::
        response: ${JSON.stringify(response.data)}`
      );
      const toolcalls = ld.get(response, "data.choices[0].message.tool_calls");
      if(!toolcalls){
        return {};
      }

      const parsedResponse = handleToolCalls(toolcalls);
      console.log(
        `function: processPitchEmailWithGPTModel:::
        parsedResponse: ${JSON.stringify(parsedResponse)}`
      );
      return parsedResponse;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function callGPTApi(request, token) {
    try {
      const response = await axios.post(
        `https://api.openai.com/v1/chat/completions`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
  
      console.log(JSON.stringify(response.data));
      return response;
    } catch (error) {
      // Handle errors here
      console.error("Error calling GPT API:", error);
      throw error; // You might want to handle or log the error accordingly
    }
  }

  function handleToolCalls(toolCallsArray) {
    console.log(
      `function: handleToolCalls :::
      ~arguments ~ 
      toolCallsArray: ${JSON.stringify(toolCallsArray)} }`
    );
    let parsedResponse = {};
    toolCallsArray.forEach(toolCall => {

        const functionName = toolCall.function.name;
        const functionResponse = JSON.parse(toolCall.function.arguments);

        console.log(
          `~ function: handleToolCalls ::: 
          functionName: ${JSON.stringify(functionName)}
          functionResponse: ${JSON.stringify(functionResponse)} 
          toolCall: ${JSON.stringify(toolCall)}`
        );
        const parsedOutputForFunction = parseToolCallReponseUsingFunctionName(functionName, functionResponse);
        parsedResponse = {...parsedResponse, ...parsedOutputForFunction};
    })

    console.log(
      `~ function: handleToolCalls ::: 
      parsedResponse: ${JSON.stringify(parsedResponse)}`
    );

    return parsedResponse;
  }





function parseToolCallReponseUsingFunctionName(functionName, functionResponse){
    switch (functionName) {

      case "PARSE_APPOINTMENT_DETAILS_FROM_CONVERSATION":
        const appointment_date = ld.get(functionResponse, "appointment_date");
        return {}; 


}}

function generate_appointment_scheduling_structure(){
    return [
      {
        "type": "function",
        "function": {
          "name": "PARSE_APPOINTMENT_DETAILS_FROM_CONVERSATION",
          "description": `Get appointment scheduling details from trasncript`,
          "parameters": {
            "type": "object",
            "required": ["appointment_date", "appointment_time", "patient_name", "patient_number", "patient_email"],
            "properties": {
              "appointment_date": {
                "type": "string",
                "format": "date",
                "description": "Date of the appointment in YYYY-MM-DD format."
              },
              "appointment_time": {
                "type": "string",
                "format": "time",
                "description": "Time of the appointment in HH:MM:SS format as a string. Return N/A if unable to extract."
              },
              "patient_name": {
                "type": "string",
                "description": "Name of the patient."
              },
              "patient_number": {
                "type": "string",
                "pattern": "^[0-9]{10}$",
                "description": "Phone number of the patient."
              },
              "patient_email": {
                "type": "string",
                "format": "email",
                "description": "Email address of the patient."
              }
            }
          }
          
        }
      },
    ]
  }


module.exports = {
    processPitchEmailWithGPTModel,
    parseToolCallReponseUsingFunctionName,
    generate_appointment_scheduling_structure,
}




