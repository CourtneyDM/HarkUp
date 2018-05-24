$(() => {

    // var currentDate = document.querySelector('input[type="datetime-local"]');
    // currentDate.value = moment().format("YYYY-MM-DD HH:mm:ss");
    $("#signup_date").val(moment().format("YYYY-MM-DD HH:mm:ss"));
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAcD-Z-rpHoK5bwrFQ5amWDJneTr-SZ59k",
        authDomain: "project-two-harkup.firebaseapp.com",
        databaseURL: "https://project-two-harkup.firebaseio.com",
        projectId: "project-two-harkup",
        storageBucket: "project-two-harkup.appspot.com",
        messagingSenderId: "614544647683"
    };
    firebase.initializeApp(config);



    // When user click the play button, playback article
    $("#play").on("click", (event) => {
        event.preventDefault();
        const title = $("#article-title").text();
        const content = $("#article-content").text();
        playArticle(title, content);

    });

    // Initialize ResponsiveVoice playback 
    function playArticle(title, content) {
        responsiveVoice.speak(title, "UK English Male");
        responsiveVoice.speak(content, "UK English Female");
    }

    // Event listener for when the Toggle Sidebar button is clicked
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    // Event listener for when the Log In button is clicked
    $("#login-btn").on("click", (e) => {

        // Initialize sign-in widget from FirebaseUI web
        var uiConfig = {
            // signInSuccessURL will load whenever user signs in, based on auth state change
            signInSuccessUrl: "/user",
            signInOptions: [
                // Leave the lines as is for the providers you want to offer your users.
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                firebase.auth.GithubAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID
            ]

        };
        // Initialize the FirebaseUI Widget using Firebase
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        // The start method will wait until the DOM is loaded.
        ui.start('#firebaseui-auth-container', uiConfig);
    });

    // Event listener for when the Sign Up button is clicked
    $("#signup-btn").on("click", (e) => {

        const user = {
            full_name: $("#name").val().trim(),
            user_email: $("#user_email").val().trim(),
            user_password: $("#user_password").val().trim(),
            signup_date: $("#signup_date").val().trim()
        };
        // const user_email = $("#user_email").val().trim();
        // const user_password = $("#user_password").val().trim();

        // User Firebase Authentication
        const auth = firebase.auth();
        const promise = auth.createUserWithEmailAndPassword(user.user_email, user.user_password);
        promise.catch(err => alert(err.message));
    });

    // Event listener for when the user state changes
    initApp = () => {
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                const user = {
                    full_name: firebaseUser.displayName,
                    user_email: firebaseUser.email
                }
                $.post("/api/user", user, data => {
                    console.log("returned from server.");
                    console.log(`Data: ${JSON.stringify(data)}`);
                })
                console.log(`Name: ${firebaseUser.displayName}`);
                console.log(`Email: " ${JSON.stringify(firebaseUser.email)}`);
            }
            else {
                console.log("No user logged in.");
            }

        }, error => { console.log(error); });

    }

    window.addEventListener('load', function () {
        initApp();
    });

    // Event listener for when the Logout Button is clicked
    $("#logout-btn").on("click", (e) => {
        firebase.auth().signOut();
        location.reload();
    });

    // Event listener for when the Dashboard link is clicked
    $("#dashboard").on("click", (e) => {
        // Get display UserID, Name, email address, date signed up
        e.preventDefault();

        $.get("/user/dashboard", data => {
            console.log(`Data for dashboard: ${JSON.stringify(data, null, 2)}`);
        });
    });
});