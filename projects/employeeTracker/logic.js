let config = {
    apiKey: "AIzaSyCYqa60B0WHyzdGFexO-kSzWB-s5D1xYq4",
    authDomain: "flaxxproject.firebaseapp.com",
    databaseURL: "https://flaxxproject.firebaseio.com",
    projectId: "flaxxproject",
    storageBucket: "flaxxproject.appspot.com",
    messagingSenderId: "283222690232"
};
firebase.initializeApp(config);

moment().format();
let database = firebase.database();

$("#submitButton").click(function () {
    event.preventDefault();

    let users = database.ref("/employees/");
    let newEmployee = users.push();
    newEmployee.set({
        "name": $("#name").val().trim(),
        "role": $("#role").val().trim(),
        "startDate": $("#startDate").val().trim(),
        "rate": $("#rate").val().trim(),
        "dateAdded": firebase.database.ServerValue.TIMESTAMP
    })

});

let employeeRef = database.ref("/employees/").orderByChild("dateAdded");

employeeRef.on('child_added', function (data) {
    let employeeData = data.val();
    let date = parseMoment(employeeData.startDate);
    $("#tableBody")
        .prepend($("<tr>")
            .append($("<td>").text(employeeData.name),
                $("<td>").text(employeeData.role),
                $("<td>").text(date.format("MM/DD/YYYY")),
                $("<td>").text(getMonthsWorked(date)),
                $("<td>").text("$" + employeeData.rate),
                $("<td>").text("$" + (employeeData.rate * getMonthsWorked(date)).toLocaleString())
            )
        );
});

function parseMoment(date) {
    return moment(date);
}

function getMonthsWorked(date){
    let currTime = moment();
    return currTime.diff(date, 'months');
}

