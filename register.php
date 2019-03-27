<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width-device-width, initial-scale-1.0">
    <link href="bootStrapCSS/bootstrap.min.css" rel="stylesheet">
    <link href="CSS/register.css" rel="stylesheet">
    <title>Registration Page</title>
</head>
<body>
<header>Smart Commute</header>
<main>
    <div class="container slected-user-container">
        <div class="row">
            <div class="col-12">
                <div class="header">
                    <h1>Registration Details</h1>
                    <p>In order to create an account, please fill in the following</p>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <form class="needs-validation" novalidate action="" method="post">
                    <div class="form-group row">
                        <label for="name" class="col-sm-2 col-form-label">Name:</label>
                        <div class="col-md-6 mb-3">
                            <input type="text" class="form-control" name="name" id="name" placeholder="Please enter a name." autocomplete="off" value="<?php if(isset($_POST['Register'])){echo $_POST['name'];} ?>" required>
                            <div class="invalid-feedback">
                                Please, enter a name.
                            </div>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="email" class="col-sm-2 col-form-label">E-Mail:</label>
                        <div class="col-md-6 mb-3">
                            <input type="text" class="form-control" name="email" id="email" placeholder="Please enter an email." autocomplete="off" value="<?php if(isset($_POST['Register'])){echo $_POST['email'];} ?>" required>
                            <div class="invalid-feedback">
                                Please, enter an email.
                            </div>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="password" class="col-sm-2 col-form-label">Password:</label>
                        <div class="col-md-6 mb-3">
                            <input type="password" class="form-control" name="password" id="password" placeholder="Please enter a password." autocomplete="off" value="<?php if(isset($_POST['Register'])){echo $_POST['password'];} ?>" required>
                            <div class="invalid-feedback">
                                Please, enter a password.
                            </div>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-outline-primary" name="Register">Register</button>

                    <p>Already registered? <a href="login.php">Login here</a></p>

                </form>
            </div>
        </div>
    </div>
<div>
    <?php
    /**
     * Created by IntelliJ IDEA.
     * User: Hristo Petkov
     * Date: 10/23/2018
     * Time: 6:10 PM
     */

    session_start();

    if(isset($_POST['Register'])){
        if(empty($_POST['password']) || preg_match('/\s/', $_POST['password']))
        {
            echo "No spaces allowed in new password!";
        }
        else {
            //Connect to the database
            $host = "devweb2018.cis.strath.ac.uk";
            $username = "cs317mads";
            $dbPass = "Te5IathaejiT";
            $dbName = "cs317mads";

            $db = new mysqli($host, $username, $dbPass, $dbName);

            $name = mysqli_real_escape_string($db, $_POST['name']);
            $email = mysqli_real_escape_string($db, $_POST['email']);
            $password = mysqli_real_escape_string($db, $_POST['password']);
            $encryptedPassword = md5($password);



            $sql = "SELECT * FROM `cs317mads`.`users` WHERE `email` = '$email'";
            if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $result = $db->query($sql);
                if (mysqli_num_rows($result) == 1) {
                    echo "User already exists";
                } else {
                    $sql2 = "INSERT INTO `cs317mads`.`users` (`id`,`username`,`password`,`email`,`bike`) VALUES (NULL ,'$name', '$encryptedPassword', '$email', NULL);";
                    if($result2 = $db->query($sql2)) {
                        header("location:login.php");
                    } else {
                        echo "Something went wrong with creating your account!";
                    }
                }
            } else {
                echo "Invalid email! Please enter a valid email";
            }
        }
    }
    ?>
</div>
</main>
<footer>Created by Group S 2019</footer>
<script src="bootStrapJavaScript/jquery-3.3.1.min.js"></script>
<script src="bootStrapJavaScript/bootstrap.min.js"></script>
<script>
    // Example starter JavaScript for disabling form submissions if there are invalid fields
    (function() {
        'use strict';
        window.addEventListener('load', function() {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('needs-validation');
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function(form) {
                form.addEventListener('submit', function(event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add('was-validated');
                }, false);
            });
        }, false);
    })();

    // Enables only numeric input
    function isNumber(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    // Function for changing the tabs from the form step wizard
    function selectStep(evt, tabName, flag) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("nav-link");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";

        if (evt.currentTarget.type === "button") {
            tablinks = document.getElementsByClassName(tabName);
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className += " active";
            }
        } else {
            evt.currentTarget.className += " active";
        }
    }

    // Get the element with id="defaultOpen" and click on it
    document.getElementById("defaultOpen").click();
</script>
</body>
</html>

