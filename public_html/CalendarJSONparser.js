/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var calendarParser = function(){
    var iccscCalendar = "https://www.googleapis.com/calendar/v3/calendars/iccsouthcharlotte@gmail.com/events?key=AIzaSyBOZIMf6P1dO1BUAanVpzsP8onRT2me11E";

    var dayOfWeek = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    var fullDayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    var recurringDatesArray = {
        events : []
    };
    var allDatesArray = {
        events : []
    };
    
    
    var today = new Date();
    //ADDS PROPER MONTH TITLE TO DROP-DOWN MENU IN UPCOMING EVENTS
    $("#currentMonth0").append(months[today.getMonth()]);
    switch(today.getMonth()){
        case 11:
            {$("#currentMonth1").append(months[0]);
            $("#currentMonth2").append(months[1]);
            $("#currentMonth3").append(months[2]);
            $("#currentMonth4").append(months[3]);}
            break;
        case 10:
            {$("#currentMonth1").append(months[11]);
            $("#currentMonth2").append(months[0]);
            $("#currentMonth3").append(months[1]);
            $("#currentMonth4").append(months[2]);}
            break;
        case 9:
            {$("#currentMonth1").append(months[10]);
            $("#currentMonth2").append(months[11]);
            $("#currentMonth3").append(months[0]);
            $("#currentMonth4").append(months[1]);}
            break;
        case 8:
            {$("#currentMonth1").append(months[9]);
            $("#currentMonth2").append(months[10]);
            $("#currentMonth3").append(months[11]);
            $("#currentMonth4").append(months[0]);}
            break;
        default:
            {$("#currentMonth1").append(months[today.getMonth()+1]);
            $("#currentMonth2").append(months[today.getMonth()+2]);
            $("#currentMonth3").append(months[today.getMonth()+3]);
            $("#currentMonth4").append(months[today.getMonth()+4]);}
    }
    
    
    $(".monthDataGroup").hide();
    $("#currentMonth0Data").show();
    
    $("#month").change(function () {
        $(".monthDataGroup").hide();
        $("#" + $(this).val()).show();
    });



    //PARSING GOOGLE CALENDAR JSON OBJECT////////////////////////////
    $.get(iccscCalendar, function(data){
        var posts = data.items;


        posts.forEach(function(item){
            console.log(item.description);

            var summary = item.summary;
            var description = item.description;


            if(item.hasOwnProperty("recurrence"))//IF the event is recurring
            {
                var str = item.recurrence[0];
                var substring = str.substring(6).split(";");
                if(substring.length === 3) //An "UNTIL" date exists (The recurring event will expire after this "UNTIL" date
                {
                    var temporaryUntilDate = substring[1].substring(6);
                    var year = temporaryUntilDate.substring(0,4);
                    var month = temporaryUntilDate.substring(4,6);
                    var day = temporaryUntilDate.substring(6,8);

                    var untilDate = {"month" : month, "day" : day, "year" : year, "fullDate" : month+"/"+day+"/"+year};
                    var byDay = substring[2].substring(6).split(",");

                    recurringDatesArray.events.push({
                        "summary" : summary,
                        "description" : description,
                        "untilDate" : untilDate,
                        "byDay" : byDay
                    });
                }
                else if(substring.length === 2) //An "UNTIL" date does NOT exist, so the event will recur indefinitely
                {
                    var untilDate = null;
                    var byDay = substring[1].substring(6).split(",");

                    recurringDatesArray.events.push({
                        "summary" : summary,
                        "description" : description,
                        "untilDate" : untilDate,
                        "byDay" : byDay
                    });
                }
            }
            else if(item.hasOwnProperty("dateTime"))//If the event is NOT recurring
            {
                var date = item.start.dateTime.split("-");
                var year = date[0];
                var month = date[1];
                var day = date[2].substring(0,2);

                allDatesArray.events.push({
                    "summary" : item.summary,
                    "description" : item.description,
                    "month" : month,
                    "day" : day,
                    "year" : year,
                    "fullDate" : month+"/"+day+"/"+year
                });
            }
        });

        
        var currentMonth = today.getMonth();    var currentYear = today.getFullYear();
        var currentMonth1;                      var currentYear1;
        var currentMonth2;                      var currentYear2;
        var currentMonth3;                      var currentYear3;
        var currentMonth4;                      var currentYear4;
        
        switch(currentMonth){
            case 11:
                {currentMonth1 = 0;     currentYear1 = currentYear + 1;
                currentMonth2 = 1;      currentYear2 = currentYear + 1;
                currentMonth3 = 2;      currentYear3 = currentYear + 1;
                currentMonth4 = 3;      currentYear4 = currentYear + 1;}
                break;
            case 10:
                {currentMonth1 = 11;    currentYear1 = currentYear;
                currentMonth2 = 0;      currentYear2 = currentYear + 1;
                currentMonth3 = 1;      currentYear3 = currentYear + 1;
                currentMonth4 = 2;      currentYear4 = currentYear + 1;}
                break;
            case 9:
                {currentMonth1 = 10;    currentYear1 = currentYear;
                currentMonth2 = 11;     currentYear2 = currentYear;
                currentMonth3 = 1;      currentYear3 = currentYear + 1;
                currentMonth4 = 2;      currentYear4 = currentYear + 1;}
                break;
            case 8:
                {currentMonth1 = 9;     currentYear1 = currentYear;
                currentMonth2 = 10;     currentYear2 = currentYear;
                currentMonth3 = 11;     currentYear3 = currentYear;
                currentMonth4 = 0;      currentYear4 = currentYear + 1;}
                break;
            default:
                {currentMonth1 = currentMonth + 1;    currentYear1 = currentYear;
                currentMonth2 = currentMonth + 2;     currentYear2 = currentYear;
                currentMonth3 = currentMonth + 3;     currentYear3 = currentYear;
                currentMonth4 = currentMonth + 4;     currentYear4 = currentYear;}
        }
        
        

        //FOR FIRST MONTH
        var firstMonth = new Date(currentYear, currentMonth + 1, 0);
        for(var k = today.getDate(); k <= firstMonth.getDate(); k++)//Loops through every day of a month
        {                
            var temporaryDay = new Date(currentYear, currentMonth, k);//Holds date iteration of loop is currently on

            allDatesArray.events.forEach(function(item){//GOES THROUGH EACH NON-RECURRING EVENT/////////////////////////////////////////////
                var dayOfEvent = new Date(item.fullDate);
                if(temporaryDay.setHours(0,0,0,0) === dayOfEvent.setHours(0,0,0,0)){
                    if(item.description !== null && item.description !== undefined){
                        $("#currentMonth0Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                        +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p>"
                                                        +"<p>" + item.description + "</p></div>");
                    }else{
                        $("#currentMonth0Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                        +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p></div>");
                    }
                }
            });//END OF FUNCTION FOR NON-RECURRING EVENTS//////////////////////////////////////

            recurringDatesArray.events.forEach(function(item){ //GOES THROUGH EACH RECURRING EVENT//////////////////////////////////////////
                if(item.untilDate !== null && item.untilDate !== undefined)//If THERE EXISTS an expiration date
                {
                    var until_Date = new Date(item.untilDate.fullDate);//Holds expiration date

                    if(temporaryDay.setHours(0,0,0,0) < until_Date.setHours(0,0,0,0))//If the expiration date hasn't passed
                    {
                        for(var i = 0; i < item.byDay.length; i++)//Loops through the days of the week an event recurs
                        {
                            if(item.byDay[i] === dayOfWeek[temporaryDay.getDay()])//If one of the event's recurring days matches the current day of the week
                            {
                                    if(item.description !== null && item.description !== undefined){
                                        $("#currentMonth0Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                                        +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p>"
                                                                        +"<p>" + item.description + "</p></div>");
                                    }else{
                                        $("#currentMonth0Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                                        +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p></div>");
                                    }
                            }
                        }
                    }
                }
                else //There is no expiration date
                {
                    for(var i = 0; i < item.byDay.length; i++)
                    {
                        if(item.byDay[i] === dayOfWeek[temporaryDay.getDay()])
                        {
                                if(item.description !== null && item.description !== undefined){
                                    $("#currentMonth0Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                                    +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p>"
                                                                    +"<p>" + item.description + "</p></div>");
                                }else{
                                    $("#currentMonth0Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                                    +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p></div>");
                                }
                        }
                    }
                }
            });//END OF FUNCTION FOR RECURRING EVENTS//////////////////////////////////
        }
            
        
            
        //FOR SECOND MONTH
        var secondMonth = new Date(currentYear1, currentMonth1 + 1, 0);
        for(var k = 1; k <= secondMonth.getDate(); k++)//Loops through every day of a month
        {
            var temporaryDay = new Date(currentYear1, currentMonth1, k);//Holds date iteration of loop is currently on
            
            allDatesArray.events.forEach(function(item){//GOES THROUGH EACH NON-RECURRING EVENT/////////////////////////////////////////////
                var dayOfEvent = new Date(item.fullDate);
                if(temporaryDay.setHours(0,0,0,0) === dayOfEvent.setHours(0,0,0,0)){
                    if(item.description !== null && item.description !== undefined){
                        $("#currentMonth1Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                        +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p>"
                                                        +"<p>" + item.description + "</p></div>");
                    }else{
                        $("#currentMonth1Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                        +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p></div>");
                    }
                }
            });//END OF FUNCTION FOR NON-RECURRING EVENTS//////////////////////////////////////
            
            recurringDatesArray.events.forEach(function(item){ //GOES THROUGH EACH RECURRING EVENT//////////////////////////////////////////

                if(item.untilDate !== null && item.untilDate !== undefined)//If THERE EXISTS an expiration date
                {
                    var until_Date = new Date(item.untilDate.fullDate);//Holds expiration date

                    if(temporaryDay.setHours(0,0,0,0) < until_Date.setHours(0,0,0,0))//If the expiration date hasn't passed
                    {
                        for(var i = 0; i < item.byDay.length; i++)//Loops through the days of the week an event recurs
                        {
                            if(item.byDay[i] === dayOfWeek[temporaryDay.getDay()])//If one of the event's recurring days matches the current day of the week
                            {
                                    if(item.description !== null && item.description !== undefined){
                                        $("#currentMonth1Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                                        +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p>"
                                                                        +"<p>" + item.description + "</p></div>");
                                    }else{
                                        $("#currentMonth1Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                                        +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p></div>");
                                    }
                            }
                        }
                    }
                }
                else //There is no expiration date
                {
                    for(var i = 0; i < item.byDay.length; i++)
                    {
                        if(item.byDay[i] === dayOfWeek[temporaryDay.getDay()])
                        {
                                if(item.description !== null && item.description !== undefined){
                                    $("#currentMonth1Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                                    +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p>"
                                                                    +"<p>" + item.description + "</p></div>");
                                }else{
                                    $("#currentMonth1Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                                    +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p></div>");
                                }
                        }
                    }
                }
            });//END OF FUNCTION FOR RECURRING EVENTS//////////////////////////////////
        }
        
        
        //FOR THIRD MONTH
        var thirdMonth = new Date(currentYear2, currentMonth2 + 1, 0);
        for(var k = 1; k <= thirdMonth.getDate(); k++)//Loops through every day of a month
        {
            var temporaryDay = new Date(currentYear2, currentMonth2, k);//Holds date iteration of loop is currently on
            
            allDatesArray.events.forEach(function(item){//GOES THROUGH EACH NON-RECURRING EVENT/////////////////////////////////////////////
                var dayOfEvent = new Date(item.fullDate);
                if(temporaryDay.setHours(0,0,0,0) === dayOfEvent.setHours(0,0,0,0)){
                    if(item.description !== null && item.description !== undefined){
                        $("#currentMonth2Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                        +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p>"
                                                        +"<p>" + item.description + "</p></div>");
                    }else{
                        $("#currentMonth2Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                        +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p></div>");
                    }
                }
            });//END OF FUNCTION FOR NON-RECURRING EVENTS//////////////////////////////////////
            
            recurringDatesArray.events.forEach(function(item){ //GOES THROUGH EACH RECURRING EVENT//////////////////////////////////////////

                if(item.untilDate !== null && item.untilDate !== undefined)//If THERE EXISTS an expiration date
                {
                    var until_Date = new Date(item.untilDate.fullDate);//Holds expiration date

                    if(temporaryDay.setHours(0,0,0,0) < until_Date.setHours(0,0,0,0))//If the expiration date hasn't passed
                    {
                        for(var i = 0; i < item.byDay.length; i++)//Loops through the days of the week an event recurs
                        {
                            if(item.byDay[i] === dayOfWeek[temporaryDay.getDay()])//If one of the event's recurring days matches the current day of the week
                            {
                                    if(item.description !== null && item.description !== undefined){
                                        $("#currentMonth2Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                                        +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p>"
                                                                        +"<p>" + item.description + "</p></div>");
                                    }else{
                                        $("#currentMonth2Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                                        +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p></div>");
                                    }
                            }
                        }
                    }
                }
                else //There is no expiration date
                {
                    for(var i = 0; i < item.byDay.length; i++)
                    {
                        if(item.byDay[i] === dayOfWeek[temporaryDay.getDay()])
                        {
                                if(item.description !== null && item.description !== undefined){
                                    $("#currentMonth2Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                                    +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p>"
                                                                    +"<p>" + item.description + "</p></div>");
                                }else{
                                    $("#currentMonth2Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                                    +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p></div>");
                                }
                        }
                    }
                }
            });//END OF FUNCTION FOR RECURRING EVENTS//////////////////////////////////
        }
            
             
        //FOR FOURTH MONTH
        var fourthMonth = new Date(currentYear3, currentMonth3 + 1, 0);
        for(var k = 1; k <= fourthMonth.getDate(); k++)//Loops through every day of a month
        {
            var temporaryDay = new Date(currentYear3, currentMonth3, k);//Holds date iteration of loop is currently on
            
            allDatesArray.events.forEach(function(item){//GOES THROUGH EACH NON-RECURRING EVENT/////////////////////////////////////////////
                var dayOfEvent = new Date(item.fullDate);
                if(temporaryDay.setHours(0,0,0,0) === dayOfEvent.setHours(0,0,0,0)){
                    if(item.description !== null && item.description !== undefined){
                        $("#currentMonth3Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                        +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p>"
                                                        +"<p>" + item.description + "</p></div>");
                    }else{
                        $("#currentMonth3Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                        +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p></div>");
                    }
                }
            });//END OF FUNCTION FOR NON-RECURRING EVENTS//////////////////////////////////////
            
            recurringDatesArray.events.forEach(function(item){ //GOES THROUGH EACH RECURRING EVENT//////////////////////////////////////////

                if(item.untilDate !== null && item.untilDate !== undefined)//If THERE EXISTS an expiration date
                {
                    var until_Date = new Date(item.untilDate.fullDate);//Holds expiration date

                    if(temporaryDay.setHours(0,0,0,0) < until_Date.setHours(0,0,0,0))//If the expiration date hasn't passed
                    {
                        for(var i = 0; i < item.byDay.length; i++)//Loops through the days of the week an event recurs
                        {
                            if(item.byDay[i] === dayOfWeek[temporaryDay.getDay()])//If one of the event's recurring days matches the current day of the week
                            {
                                    if(item.description !== null && item.description !== undefined){
                                        $("#currentMonth3Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                                        +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p>"
                                                                        +"<p>" + item.description + "</p></div>");
                                    }else{
                                        $("#currentMonth3Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                                        +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p></div>");
                                    }
                            }
                        }
                    }
                }
                else //There is no expiration date
                {
                    for(var i = 0; i < item.byDay.length; i++)
                    {
                        if(item.byDay[i] === dayOfWeek[temporaryDay.getDay()])
                        {
                                if(item.description !== null && item.description !== undefined){
                                    $("#currentMonth3Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                                    +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p>"
                                                                    +"<p>" + item.description + "</p></div>");
                                }else{
                                    $("#currentMonth3Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                                    +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p></div>");
                                }
                        }
                    }
                }
            });//END OF FUNCTION FOR RECURRING EVENTS//////////////////////////////////
        }
            
            
        //FOR FIFTH MONTH
        var fifthMonth = new Date(currentYear4, currentMonth4 + 1, 0);
        for(var k = 1; k <= fifthMonth.getDate(); k++)//Loops through every day of a month
        {
            var temporaryDay = new Date(currentYear4, currentMonth4, k);//Holds date iteration of loop is currently on
            
            allDatesArray.events.forEach(function(item){//GOES THROUGH EACH NON-RECURRING EVENT/////////////////////////////////////////////
                var dayOfEvent = new Date(item.fullDate);
                if(temporaryDay.setHours(0,0,0,0) === dayOfEvent.setHours(0,0,0,0)){
                    if(item.description !== null && item.description !== undefined){
                        $("#currentMonth4Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                        +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p>"
                                                        +"<p>" + item.description + "</p></div>");
                    }else{
                        $("#currentMonth4Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                        +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p></div>");
                    }
                }
            });//END OF FUNCTION FOR NON-RECURRING EVENTS//////////////////////////////////////
            
            recurringDatesArray.events.forEach(function(item){ //GOES THROUGH EACH RECURRING EVENT//////////////////////////////////////////

                if(item.untilDate !== null && item.untilDate !== undefined)//If THERE EXISTS an expiration date
                {
                    var until_Date = new Date(item.untilDate.fullDate);//Holds expiration date

                    if(temporaryDay.setHours(0,0,0,0) < until_Date.setHours(0,0,0,0))//If the expiration date hasn't passed
                    {
                        for(var i = 0; i < item.byDay.length; i++)//Loops through the days of the week an event recurs
                        {
                            if(item.byDay[i] === dayOfWeek[temporaryDay.getDay()])//If one of the event's recurring days matches the current day of the week
                            {
                                    if(item.description !== null && item.description !== undefined){
                                        $("#currentMonth4Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                                        +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p>"
                                                                        +"<p>" + item.description + "</p></div>");
                                    }else{
                                        $("#currentMonth4Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                                        +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p></div>");
                                    }
                            }
                        }
                    }
                }
                else //There is no expiration date
                {
                    for(var i = 0; i < item.byDay.length; i++)
                    {
                        if(item.byDay[i] === dayOfWeek[temporaryDay.getDay()])
                        {
                                if(item.description !== null && item.description !== undefined){
                                    $("#currentMonth4Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                                    +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p>"
                                                                    +"<p>" + item.description + "</p></div>");
                                }else{
                                    $("#currentMonth4Data").append("<div id=\"calendarEvent\"><p>" + item.summary + "</p>"
                                                                    +"<p>" + fullDayOfWeek[temporaryDay.getDay()] + ", " + months[temporaryDay.getMonth()] + " " + temporaryDay.getDate() + "</p></div>");
                                }
                        }
                    }
                }
            });//END OF FUNCTION FOR RECURRING EVENTS//////////////////////////////////            
        }

    });    
    
};