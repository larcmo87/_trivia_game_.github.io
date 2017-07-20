$(document).ready(function(){
	var arrayIndexCount = 0;
	var unansweredQuestions = 0;
	var triviaQuestions = [];  // array that will hold quiz questions
	var triviaAnswers = []; //array that will hold quiz answers
	var correctAnswer = ""; //global variable that holds the correct answer for comparison logic
	var correctAnswerCount = 0;
	var incorrectAnswerCount = 0;
	var responseObjects = {};
	var timerInterval = 0;
	var showTotals = false;
	var selectedAnswer = false;
	var answerValue = "";

	// questionsAndAnswers[{question: "", wrongAnswer1:"", wrongAnswer1:"", wrongAnswer1:""}]

	$('.start_button').on('click',function(){
		// runTimer(5,false,false);
		$( "#check_box" ).prop( "checked", false );
		$(".start_button").css({"display":"none"});
		$('.trivia_banner').css({"display":"none"});

		event.preventDefault();
       
       //call to the getQuestionsAndAnswers function to get the questions and answers using API
       getQuestionsAndAnswers()
        runTimer(10,false,false);

        
	});
	var setTimerVisibility = function(value){
		$('#timer_count').css({"visibility":"visible"});

	}
	var runTimer = function(seconds, onclickEvent, result,str){
		 var resultShown = false;
		 // if(onclickEvent){
		 // 	$('#timer_count').css({"visibility":"visible"});
		 // 	clearInterval(timerInterval);
		 // 	runTimer(10,true,false);
		 // }
		 console.log(str);
		timerInterval =	setInterval(function(){ 
		 
			
			 seconds--;
			
    		$('#seconds').html(seconds );

    		if(seconds <= 0){
    			unansweredQuestions++;
    			console.log("arrayIndexCount before adding" + arrayIndexCount);
    			if(arrayIndexCount < 5){
    				// arrayIndexCount++;  //increment the global array index count by 1
    				console.log("arrayIndexCount" + arrayIndexCount);
    				clearInterval(timerInterval); //clear current setInterval

    				//update the responseObjects incorrect answers array
    				updateQuestionAndAnswers(responseObjects);
    				
    				var trivQuestion = triviaQuestions[arrayIndexCount];

    				//lenght of the responseObjects result incorrect answer array
    				var arryLength = responseObjects.results[arrayIndexCount].incorrect_answers.length;
    				//clear the h1 elements of class' question_answers_row1 and question_answers_row2
    				$(".question_answers_row1 div h2").html("");
    				$(".question_answers_row2 div h2").html("");
    				$("#answer_response_container").html("");
    				//loop through the incorrect answers array and display the answers on the page
    				for(var i = 0; i < arryLength; i++){
    					var answr = responseObjects.results[arrayIndexCount].incorrect_answers[i];
    					displayQuestionAnswers(trivQuestion, answr, i);
    					

    				 
    				}
    				// arrayIndexCount++;
    				
    				// clearInterval(timerInterval);
    				// runTimer(5,false,false,"ran from here"); //reset timer
    			}

    			if(arrayIndexCount >= 5){

    				displayTotals();
    					// $("#answer_container").css({"visibility":"hidden"});
    					// $("#total_results").append("<h2>Number of correct guesses " + correctAnswerCount + "</h2>")
    					// $("#total_results").append("<h2>Number of incorrect guesses " + + "</h2>")
    					// $("#total_results").append("<h2>Number of not answered guesses " + unansweredQuestions + "</h2>")
    					
    				clearInterval(timerInterval);
    			}else{
    				arrayIndexCount++;
    			clearInterval(timerInterval);
    				runTimer(10,false,false); //reset timer
    			}
    			
    			
    			// runTimer(10,false,false); //reset timer
    		}else if(onclickEvent && !result){

    				onclickEvent = false;


    				$("#answer_response_container").html("");
    				$('#timer_count').css({"visibility":"visible"});
    				$("#answer_container").css({"visibility":"visible"});

    				if(arrayIndexCount < 5){
    					arrayIndexCount++;  //increment the global array index count by 1
	    				console.log("arrayIndexCount" + arrayIndexCount);	

	    				//update the responseObjects incorrect answers array
	    				updateQuestionAndAnswers(responseObjects);
	    				
	    				var trivQuestion = triviaQuestions[arrayIndexCount];
	    				$("#answer_container").css({"visibility":"visible"});
	    				$('#timer_count').css({"visibility":"visible"});
	    				//lenght of the responseObjects result incorrect answer array
	    				var arryLength = responseObjects.results[arrayIndexCount].incorrect_answers.length;
	    				//clear the h1 elements of class' question_answers_row1 and question_answers_row2
	    				$(".question_answers_row1 div h2").html("");
	    				$(".question_answers_row2 div h2").html("");

    				//loop through the incorrect answers array and display the answers on the page
	    				for(var i = 0; i < arryLength; i++){
	    					var answr = responseObjects.results[arrayIndexCount].incorrect_answers[i];
	    					displayQuestionAnswers(trivQuestion, answr, i);
	    					
	    					
	    				}
    				}

    				if(arrayIndexCount >=5 ){
    					// showTotals = true;
    					if(timerInterval === 0){
    						displayTotals();
    						clearInterval(timerInterval); 
    					}
    					// clearInterval(timerInterval); 

    				}

    		}else if(!onclickEvent && result){
    			if(timerInterval > 0){
    				resultShown = false;
    				$('#timer_count').css({"visibility":"hidden"});

    				displayCorretWrongAnswer(selectedAnswer,answerValue) //parameter true for correct answer
    				
    				// clearInterval(timerInterval);   			

    				// runTimer(15, true, false);

    				result = false;
		    	}else{
		    		resultShown = true;
		    		clearInterval(timerInterval);
		    		runTimer(10, true, false);
		    		   				
		    	}
    			if(timerInterval <= 0){
    				// $('#timer_count').css({"visibility":"visible"});
    				
    			}
    			
    				
    		}// }else if(arrayIndexCount >= 4){

    		// 			alert("index array reached");
    		// 			$("#arrayIndexCount").append("<h2> Number of correct guesses " + correctAnswerCount + "</h2>")
    		// 			$("#arrayIndexCount").append("<h2> Number of incorrect guesses " + + "</h2>")
    		// 			$("#arrayIndexCount").append("<h2> Number of not answered guesses " + unansweredQuestions + "</h2>")
    					
    		// }
			
			//Change the question and answers after the result has been show
    		if(resultShown){
    			$('#timer_count').css({"visibility":"visible"});
    			// clearInterval(timerInterval);   			

    			runTimer(10, true, false);
    		}


		}, 1000);
    		

	}

	var displayCorretWrongAnswer = function(correct,str){
		// $("#answer_container").css({"visibility":"hidden"});
		$("#answer_response_container").html("");
    	$('#timer_count').css({"visibility":"hidden"});

		if(correct){
			$("#answer_response_container").append("<h2>Corret! " + correctAnswer + " is the correct answer</h2>");
		}else{
			$("#answer_response_container").append("<h2>Nope! " + str + " is the incorrec answer</h2>");
		
		}
	}

	var displayTotals = function(){
		$("#answer_container").css({"visibility":"hidden"});
		$("#answer_response_container").html("");
    	$('#timer_count').css({"visibility":"hidden"});
    	$("#total_results").append("<h2>Number of correct guesses " + correctAnswerCount + "</h2>")
    	$("#total_results").append("<h2>Number of incorrect guesses " + + "</h2>")
    	$("#total_results").append("<h2>Number of not answered guesses " + unansweredQuestions + "</h2>")
	}
	var displayQuestionAnswers = function(quest, answr, answerCount){
		// setTimerVisibility();
		$("#quiz_question").text(quest);
			console.log("anser " + answr);
			console.log("anser count " + answerCount);

			
		if(answerCount === 0){ //display answers 1 and 2 in the div of class uestion_answers_row1
			
			

	       	$(".answer1 h2").html(answr);
	     }else if(answerCount === 1){//display answers 3 and 4 in the div of class uestion_answers_row2
	       	$(".answer2 h2").text(answr);
	     }else if(answerCount === 2){
	     	$(".answer3 h2").text(answr);
	     }else if(answerCount === 3){
	     	$(".answer4 h2").text(answr);
	     }

	}

	var updateQuestionAndAnswers = function(objct){
		$('#timer_count').css({"visibility":"visible"});
		//capture the correct answer in global variable correctAnswer
	       correctAnswer = objct.results[arrayIndexCount].correct_answer;

	       //add the correct answer to the incorrect_answers array of the global 
	       //object responseObjects. This way we can use all the answers from 1 array

	       	objct.results[arrayIndexCount].incorrect_answers.push(correctAnswer);

	       objct.results[arrayIndexCount].incorrect_answers = randomizeAnswers(objct.results[arrayIndexCount].incorrect_answers);
	}

	var getQuestionsAndAnswers = function(){

		//API URL
		var queryURL = "https://opentdb.com/api.php?amount=5&category=20&difficulty=medium&type=multiple";
        
         $.ajax({
          url: queryURL,
          method: "GET"
        }).done(function(response) {
         console.log(response);
          // $('#movie-view').append("<p>" + JSON.stringify(response) + "</p>");
          
          responseObjects = response;
          //console.log("responseObjects " + responseObjects);
          var quest = response.results[0].question;
	       // $("#quiz_question").text(quest);

	       //capture the correct answer in global variable correctAnswer
	       updateQuestionAndAnswers(response);
	       // correctAnswer = response.results[arrayIndexCount].correct_answer;

	       // //add the correct answer to the incorrect_answers array of the global 
	       // //object responseObjects. This way we can use all the answers from 1 array
	       // 	responseObjects.results[arrayIndexCount].incorrect_answers.push(correctAnswer);
	       
	       for(var q = 0; q < response.results.length; q++){
	       		//add all of the question to global array triviaQuestions
	       		triviaQuestions.push(response.results[q].question);

	       }
	       // for(var i = 0; i < response.results[arrayIndexCount].incorrect_answers.length; i++){
	       // 		//add all of the object answers to global array triviaAnswers
	       // 		triviaAnswers.push(response.results[arrayIndexCount].incorrect_answers[i]);
	       		
	       // }
	       // ush(response.results[arrayIndexCount].incorrect_answers[i]);

	       response.results[arrayIndexCount].incorrect_answers = randomizeAnswers(response.results[arrayIndexCount].incorrect_answers);

	       for(var i = 0; i < response.results[arrayIndexCount].incorrect_answers.length; i++){
	       		//add all of the object answers to global array triviaAnswers
	       		// triviaAnswers.push(response.results[arrayIndexCount].incorrect_answers[i]);
	       		
	       		var answr = response.results[arrayIndexCount].incorrect_answers[i];

	       		displayQuestionAnswers(quest,answr, i) //$(".question_answers_row1").append("<div><h2>" + answr + "</h2></div>")
	       		
	       }
	       
	       console.log(arrayIndexCount);
	       
        }); 
	}

	var randomizeAnswers = function(arry){
		var count = arry.length,
		   randomnumber,
		    temp;
		 while( count ){
		  randomnumber = Math.random() * count-- | 0;
		  temp = arry[count];
		  arry[count] = arry[randomnumber];
		  arry[randomnumber] = temp
		 }
		 return arry;
	}

	var getAnswers = function(){
		
		var quest = responseObjects.results[arrayIndexCount].question;
		for(var i = 0; i < arryLength; i++){
    					var answr = responseObjects.results[arrayIndexCount].incorrect_answers[i];
    					displayQuestionAnswers(quest, answr, i);
    					
    					
    	}

	}

	$(".answer1").click(function(){
		answerValue = $(".answer1 h2").text();
		if(correctAnswer === $(".answer1 h2").text()){
			correctAnswerCount++;
			// arrayIndexCount++;
			selectedAnswer = true;
			// updateQuestionAndAnswers(responseObjects);
			// getAnswers();
			clearInterval(timerInterval); 
			runTimer(5, false, true);
			
		}else{
			incorrectAnswerCount++;
			selectedAnswer = false;
			
			clearInterval(timerInterval); 
			runTimer(5, false, true);
		}
	});
	$(".answer2").click(function(){
		answerValue = $(".answer2 h2").text();
		if(correctAnswer === $(".answer2 h2").text()){
			correctAnswerCount++;
			// arrayIndexCount++;
			selectedAnswer = true;
			clearInterval(timerInterval); 
			runTimer(5, false, true);
		}else{
			incorrectAnswerCount++;
			selectedAnswer = false;
			
			clearInterval(timerInterval); 
			runTimer(5, false, true);
		}
	});
	$(".answer3").click(function(){
		answerValue = $(".answer3 h2").text();
		if(correctAnswer === $(".answer3 h2").text()){
			correctAnswerCount++;
			// arrayIndexCount++;
			selectedAnswer = true;
			clearInterval(timerInterval); 
			runTimer(5, false, true);
		}else{
			incorrectAnswerCount++;
			selectedAnswer = false;
			
			clearInterval(timerInterval); 
			runTimer(5, false, true);
		}
	});
	$(".answer4").click(function(){
		answerValue = $(".answer4 h2").text();
		if(correctAnswer === $(".answer4 h2").text()){
			correctAnswerCount++;
			// arrayIndexCount++;
			selectedAnswer = true;
			// updateQuestionAndAnswers(responseObjects);
			// getAnswers();
			clearInterval(timerInterval); 
			runTimer(5, false, true);
			
			// clearInterval(timerInterval); 
			// runTimer(10, true, false);
		}else{
			incorrectAnswerCount++;
			selectedAnswer = false;
			
			clearInterval(timerInterval); 
			runTimer(5, false, true);
		}
	});
	// $('.answer1').on('click',function(){
		
	// 		// console.log(correctAnswer);
	// 		console.log($("#answer1 h2").text());
	// 	if(correctAnswer === $("div").attr("data-answer")){
	// 		correctAnswerCount++;
	// 		alert("correct");
	// 		$("answer_response_container").append("<h2>Corret! " + correctAnswer + " is the corrrect answer</h2>");
	// 		console.log("correct Answer " + correctAnswer);
	// 	}else {

	// 		incorrectAnswerCount++;
	// 	}
	// });
	
});