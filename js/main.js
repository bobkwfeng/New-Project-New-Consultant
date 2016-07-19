/*Created by Bob Feng, 07/14/2016*/
// This is for getting value of the checkbox.
var haveInterview = false;
var haveSurvey = false;
// This id is for listing consultants as a list.
var consultantIdForShow;
// This is the key-value pair for the consultantlist key: position in the list. value: the username.
var map = {};
// This is the key-value pair for deleting consultant key: position in the list. value: the userid.
var map2 = {};

var index = 0;

function validInterview() {
	haveInterview = !haveInterview;
}

function validSurvey() {
	haveSurvey = !haveSurvey;
}

function getCheckBoxValue() {
	console.log(haveInterview);
	console.log(haveSurvey);
}

// This is used to manipulate the consultant list(Store the selected position).
function chooseList(id) {
	console.log(id);
	//document.getElementById(id).className = "list-group-item active";
	consultantIdForShow = Number(id.charAt(10));
	console.log(consultantIdForShow);
}

function setUpDetail() {
	document.getElementById("username2").innerHTML = map[consultantIdForShow];
	console.log(map[consultantIdForShow]);
}



$(function (){
	var $data = $('#consultantList');
	var $name = $('#projectName');
	var $detail = $('#projectDetail');
	var $consultantEmailC = $('#email1');
	var $consultantPhoneNumberC = $('#phoneNumber1');
	var $consultantUserNameC = $('#username1');
	var $consultantPasswordC = $('#password1');


    // This is the function for getting the list when page load.
	$.ajax({
		type: 'GET',
		url: 'http://localhost:8080/NewtonSurvey/rest/getAllConsultants',
		success: function(data) {
			console.log('success',data);
			$.each(data, function(i, user) {
				console.log(i);
				$data.append('<a class="list-group-item" onclick="chooseList(this.id)" id="consultant'+ i +'">'+user.username+'</a>');
				// This is for filling the map with key-value pair
				map[i] = user.username;
				map2[i] = user.id;
				i++;
			});
			// Testing
			console.log(map);
			//console.log(map[0]);
		},
		error: function() {
			console.log("Error Loading Consultant List");
			$data.append('<li>Error Loading Consultant List</li>');
		}
    });

	// This is the function for createProject.
    $('#createProject').on('click', function() {
    	if (consultantIdForShow == null) {
    		alert("You have to choose a consultant first.");
    	} else {
    		var project = {
    		name: $name.val(),
    		details: $detail.val(),
    		hasInterviews: haveInterview.toString(),
    		hasSurveys: haveSurvey.toString(),
    		createBy: map[consultantIdForShow]
    	};
	    	$.ajax({
	    		type: 'POST',
	    		beforeSend: function (request)
	            {
	                request.setRequestHeader("Content-Type", 'application/json');
	            },
	    		url: 'http://localhost:8080/NewtonSurvey/rest/createProject',
	    		data: JSON.stringify(project),
	    		success: function() {
	    			console.log(project);
	    		},
	    		error: function() {
	    			console.log('Error Creating Project');
	    		}
	    	});
        }
    });


    // This is the function for delete Consultant
    $('#deleteConsultant').on('click', function() {
    	if (consultantIdForShow == null) {
    		alert("You have to choose a consultant first.");
    	} else {
    		var user = {
    			'"userId"': map2[consultantIdForShow]
    		};

    		$.post("http://localhost:8080/NewtonSurvey/rest/deleteUser", {"userId":map2[consultantIdForShow]}, 
    		function(data) {
    			document.getElementById('consultant'+consultantIdForShow).parentNode.removeChild(document.getElementById('consultant'+consultantIdForShow));
        		console.log("Successfully Removed Selected Consultant.");
    		});




	    	// $.post({
	    	// 	//type: 'POST',
	    	// 	beforeSend: function (request)
	     //        {
	     //            request.setRequestHeader("Content-Type", 'application/json');
	     //        },
	    	// 	url: 'http://localhost:8080/NewtonSurvey/rest/deleteUser',
	    	// 	data: JSON.stringify(user),
	    	// 	success: function() {
	    	// 		console.log(user);
	    	// 	},
	    	// 	error: function() {
	    	// 		console.log('Error Deleting User');
	    	// 		console.log(user);
	    	// 	}
	    	// });
        }
    });

 	// This is the function for create new consultant
    $('#createConsultant').on('click', function() {

    	if (document.getElementById('password1').value != document.getElementById('password2').value) {
            alert("Two Password Must Be Identical.");
         } else {
         	var consultant = {
	    		email: $consultantEmailC.val(),
	    		phoneNumber: $consultantPhoneNumberC.val(),
	    		username: $consultantUserNameC.val(),
	    		passwordHash: $consultantPasswordC.val()
    		};
    		//console.log($consultantEmailC.val().toString());
    		console.log(JSON.stringify(consultant));
    		$.ajax({
	    		type: 'POST',
	    		beforeSend: function (request)
	            {
	                request.setRequestHeader("Content-Type", 'application/json');
	            },
	    		url: 'http://localhost:8080/NewtonSurvey/rest/addConsultant',
	    		data: JSON.stringify(consultant),
	    		//data: '{"username":"hehe"}',
	    		success: function() {
	    			console.log(consultant);
	    		},
	    		error: function() {
	    			console.log('Error Creating Consultant');
	    		}
	    	});
         }

    });

});



