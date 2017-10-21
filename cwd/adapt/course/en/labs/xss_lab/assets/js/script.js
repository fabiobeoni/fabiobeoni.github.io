$(function () {
  $('#addReview').click(function () {
    var username = $('#nameField').val()
    var subject = $('#subjectField').val()
    var text = $('#reviewField').val()
    var stars = $('#starsField').val()
    appendReview(username, subject, text, stars)
  })

  $('#clearReviews').click(function() {
    $('#review_list').empty()
  })
})


function appendReview(username, subject, text, stars) {
  var star_array = []

  for (var i=0; i < 5; i++) {
    star_array[i] = (stars >= i+1);
  }
  
  console.log(stars)
  data = {
    name: username,
    subject: subject,
    text: text,
    stars: star_array
  } 
  
  var theTemplateScript = $("#review_template").html();
  var theTemplate = Handlebars.compile (theTemplateScript);
  $('#review_list').append(theTemplate(data))
}
