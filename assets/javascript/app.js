var email
var password
var commentCount = 0



var config = {
  apiKey: "AIzaSyAn5NoP9LgIzSdhe8-H_zmBhAUOxWz7Huc",
  authDomain: "deuce-dash.firebaseapp.com",
  databaseURL: "https://deuce-dash.firebaseio.com",
  storageBucket: "deuce-dash.appspot.com",
  projectId: "deuce-dash"
}

firebase.initializeApp(config)

var database = firebase.database()
var db = firebase.firestore()
var auth = firebase.auth()


var myMap



function initMap() {
  var myLatLng = {
    lat: 40.782710,
    lng: -73.965310
  };

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: myLatLng
  })

  myMap = map


}

$(document).ready(function () {

  database.ref().on("child_added", function (childSnapshot) {
    var lat = childSnapshot.val().lat
    var lng = childSnapshot.val().lng
    var address = childSnapshot.val().address
    var coord = new google.maps.LatLng(lat, lng)
    // addMarker(coord, address)
  })

  function addMarker(coordinates, address) {
    var marker = new google.maps.Marker({
      position: coordinates,
      map: myMap,
      title: address
    })
    marker.addListener('click', function () {
      
      var address = $("#comment-header")
      var comments = $("#comments")
      address.empty()
      comments.empty()
      address.text(this.title)
      db.collection("users").get().then(function(snapshot){
        console.log(snapshot.docs)
        snapshot.docs.forEach(function(doc){
            // renderComments(doc)
            console.log(doc.id)
        })

      })
      
    })
  }

  function renderComments(doc){
    var comments = $("#comments")
    var newComment = $("<p>")
      console.log("1")
      console.log(doc.data())
      console.log("2")
      
    if(doc.id == $("#comment-header").text()){
    }
  }

  function convertLocation(location, address) {
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=AIzaSyCkioyz1epNmUDEt2m_AnGPVYsD89b-E3g"
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      var lat = response.results[0].geometry.location.lat
      var lng = response.results[0].geometry.location.lng
      var coord = new google.maps.LatLng(lat, lng)

      database.ref().push({
        lat: lat,
        lng: lng,
        address: address
      })

      addMarker(coord, address)
    })
  }

  function addPlus(string) {
    stringArray = string.split(" ")
    var stringPlus = stringArray[0]
    for (i = 1; i < stringArray.length; i++) {
      stringPlus = stringPlus + "+" + stringArray[i]
    }
    return (stringPlus)
  }

  function capitalizeWords(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  var modal = document.getElementById("add-modal");
  // var btn = document.getElementById("myBtn");
  // var span = document.getElementsByClassName("close")[0];

  $("#add-button").on("click", function () {
    $("#add-modal").css("display", "block")
    $("#address-input").focus()

    $("#submit").on("click", function () {
      convertLocation(addPlus($("#address-input").val()), capitalizeWords($("#address-input").val()))
      $("#address-input").val("")
    })

    $("#cancel").on("click", function () {
      $("#address-input").val("")
    })
  })

  $(".new-location-button").on("click", function () {
    $("#add-modal").fadeOut(200)
  })

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  $("#login-link").on("click", function(){
    $("#map").css("display","none")
    $("#login-form").css("display","block")
    $("#display").css("background", "grey")
  })

  $("#login-btn").on("click", function(){
    email = $("#input-email").val()
    password = $("#input-password").val()
    console.log(password)
    var promise = auth.signInWithEmailAndPassword(email, password)
    promise.catch(function(e){
      console.log(e.message)
    })
    // console.log(promise)
    // $("#input-email").val("")
    // $("#input-password").val("")
  })

  $("#sign-up-btn").on("click", function(){
    email = $("#input-email").val()
    password = $("#input-password").val()
    var user = auth.currentUser
    var promise = auth.createUserWithEmailAndPassword(email, password)
    promise.catch(function(e){
      console.log(e.message)
    })
    db.collection("users").doc(user.uid).set({
      email: email
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    })
    $("#login-form").css("display","none")
    $("#map").css("display","block")
  })

  $("#new-comment-btn").on("click", function(){
    var commentDiv = $("<div>")
    var userDiv = $("<div>")
    userDiv.text(auth.currentUser.email)
    commentDiv.text($("#comment-box").val())
    $("#reviews").append(userDiv)
    $("#reviews").append(commentDiv)
    console.log(email)
    console.log($("#comment-box").val())
    console.log($("#comment-header").text())
    console.log(auth.currentUser.uid)
    db.collection("reviews").doc($("#comment-header").text()).collection(auth.currentUser.email).add({
      email: email,
      comment: $("#comment-box").val()
    })

  })



convertLocation(addPlus("168-02 P.O Edward Byrne Ave."),"168-02 P.O Edward Byrne Ave.")
convertLocation(addPlus("64-2 Catalpa Avenue"), "64-2 Catalpa Avenue")
convertLocation(addPlus("92-08 222nd Street"), "92-08 222nd Street")



})
  firebase.auth().onAuthStateChanged(function(firebaseUser){
    if(firebaseUser){
      console.log(firebaseUser)
    }
    else{
      console.log('not logged in')
    }
  })