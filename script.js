//script.js
//8-20-2011

//global date
var reset = new Date(localStorage["reset"])
var date = new Date()

if (localStorage["date"] && reset.getDate() == date.getDate()){
	date = new Date(localStorage["date"])
}
else{
	localStorage["date"] = date
	localStorage["reset"] = date
}
//initial load
var date_string = dateToString(date, true)
load(date_string)

//inital date
$('.display-date').val(date_string)

// --------- on doc ready ----------
$(document).ready(function(){


//next day
$('.next').click(function(){
	$('.progress').css('display','inline')
	$('.calender').empty()
	date.setDate(date.getDate()+1)
	$('.display-date').val(dateToString(date, true))
	load(dateToString(date, true))
	
	//analytics
	trackButton('-next')
	
	//update local storage
	localStorage["date"] = date
	console.log(localStorage["date"])
	localStorage["reset"] = new Date()
})
//today
$('.today').click(function(){
	$('.progress').css('display','inline')
	$('.calender').empty()
	date = new Date()
	$('.display-date').val(dateToString(date, true))
	load(dateToString(date, true))
	
	//analytics
	trackButton('-today')
	
	//update local storage
	localStorage["date"] = date
	console.log(localStorage["date"])
	localStorage["reset"] = new Date()
})

//previous day
$('.previous').click(function(){
	$('.progress').css('display','inline')
	$('.calender').empty()
	date.setDate(date.getDate()-1)
	$('.display-date').val(dateToString(date, true))
	load(dateToString(date, true))
	
	//analytics
	trackButton('-previous')
	
	//update local storage
	localStorage["date"] = date
	console.log(localStorage["date"])
	localStorage["reset"] = new Date()
})

//date picker
$('.display-date').datepicker({  
	dateFormat: 'yy-mm-dd',
	onSelect: function(dateText, inst) {
	$('.progress').css('display','inline')
	$('.calender').empty()
	date = $(this).datepicker("getDate")
	load(dateToString(date, true))
	
	//analytics
	trackButton('-picker')
	
	//update local storage
	localStorage["date"] = date
	localStorage["reset"] = new Date()
	}
})

})


// ----------- stock functions ------------

//load calender
function load(day){
$.getJSON('http://events.cs50.net/api/1.0/events?dtstart=' + day + '&output=json',
	  function(data){
			//clear calender for network lags !! needs more work !!
			if (day == dateToString(date, true)){
				
			$('.calender').empty()
			//if no event
			if (jQuery.isEmptyObject(data))
				$('.calender').append('<div class = "no-event">No events today!<img src="no-event.gif" /></div>')
			else{
	      $.each(data, function(key, event){

			//calculate event time
			try{
				var start = event.dtstart.match(/\d+:\d+/)[0]
				var end = event.dtend.match(/\d+:\d+/)[0]
			}catch(err){end = start}
			var time = ''
			if(start == end)
				time = start
			else
				time = start + '-' + end

	 	  $('.calender').append(
		  $('<li/>').addClass('event').click(function(){
							$('.open').children('.details').toggle('slow');
							$('.open').removeClass('open');
							if($(this).children('.details').css('display') == 'none'){
								
								$(this).children('.details').toggle('slow');								
								$(this).addClass('open');
							}
							}).append($('<a href=""/>').addClass('gcal').click(
							function(){return gcal($(this))})).append($('<td class = "time"/>').append(
							time)).append($('<td class = "summary"/>').append(event.summary)).append(
		       	  $('<ul/>').addClass('details').append($('<li/>').addClass('location').append(event.location)).append(
						  $('<li/>').addClass('description').append(event.description))))
			
			if(event.description == null){
				$('.description:last').append('No event detail available.')
			}

			})}
		}}).complete(
			function(){$('.progress').css('display','none')		
			$('.gcal').hover(function(){
				$(this).css('opacity', 1)
			})
			$('.gcal').mouseleave(function(){
				$(this).css('opacity', .3)
			})
	})
}


//pop out gcal
function gcal(target){
	//parse time
	var parsed_time = target.siblings('.time').text().match(/\d{2}/g)
	var start = parsed_time[0] + parsed_time[1]
	var end = parsed_time[2] + parsed_time[3]
	if (isNaN(end))
		var end = start
	var date_string = dateToString(date, false)

	//prep url
	var time = date_string + 'T' + start + '00/' + date_string + 'T' + end + '00'
	var event = target.siblings('.summary').text()
	var location = target.siblings('.details').find('.location').text()

	var url = 'https://www.google.com/calendar/render?action=TEMPLATE&dates='
			+ time
			+ '&text='
			+ event
			+ '&location='
			+ location
			+'&pli=1&sf=true&output=xml'
	
	window.open(url)
	return false	
}

//date to string
function dateToString(date, hyphen){
	var month = ''
	if (date.getMonth() < 9)
		month = '0' + (date.getMonth() + 1)
	else
		month = (date.getMonth() + 1)

	var day = ''
	if (date.getDate() < 10)
		day = '0' + date.getDate()
	else
		day = date.getDate()

	if (hyphen){
		return date.getFullYear() + '-' + month + '-'+ day
	}
	else{
		return '' + date.getFullYear() + month + day
	}
}

function trackButton(button_id) {
	_gaq.push(['_trackEvent', 'button' + button_id, 'clicked']);
};