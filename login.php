<?php
/**
 * Created by IntelliJ IDEA.
 * User: Hristo Petkov
 * Date: 3/21/2019
 * Time: 5:14 PM
 */
session_start();

//Connect to the database
$host = "devweb2018.cis.strath.ac.uk";
$username = "cs317mads";
$dbPass = "Te5IathaejiT";
$dbName = "cs317mads";

$db = new mysqli($host, $username, $dbPass, $dbName);

$email = $pwd = $wrong_acc_info = "";
$update_state = $new_pass_info = $no_such_email = "";

if(isset($_POST['LogIn'])) {
    $is_correct_email = $is_correct_pwd = false;

    $pwd = isset($_POST["password"])? mysqli_real_escape_string($db, $_POST["password"]): "";

    if(empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $is_correct_email = false;
    }
    if (empty($_POST["email"])) {
        //$email_err = "Email is required!";
    } else {
        $email = mysqli_real_escape_string($db, $_POST["email"]);
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $is_correct_email = true;
        } else {
            $email = "";
            //$email_err = "Invalid email!";
        }
    }
    if(!empty($pwd)) {
        $is_correct_pwd = true;
    }
    if($is_correct_email && $is_correct_pwd) {
        $encryptedPassword = md5($pwd);
        $result = mysqli_query($db, "SELECT * FROM `cs317mads`.`users` WHERE `email` = '$email' AND `password` = '$encryptedPassword'");

        if($result->num_rows == 1) {
            while ($row = $result->fetch_assoc()) {
                $_SESSION['id'] = $row['id'];
                $_SESSION['name'] = $row['username'];
                $_SESSION['email'] = $email;
//                if ($row['institute'] == null) {
//                    $_SESSION['user-type'] = 'normal';
//                    header("location:userhome.php");
//                } else {
//                    $_SESSION['user-type'] = 'owner';
//                    $_SESSION['inst'] = $row['institute'];
//                    header("location:ownerhome.php");
//                }

                $_SESSION['logged-in'] = true;
            }
        } else {
            $wrong_acc_info = "Wrong email or password!";
        }
    }
}

elseif(isset($_POST["pwdreset"])) {

    $email = mysqli_real_escape_string($db, $_POST["email"]);
    $email_found = 0;
    $sql = "SELECT * FROM users";
    $result = $db->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            if($row["email"] === $email) {
                $email_found = 1;
                break;
            }
        }
    }

    if($email_found === 1) {
        $newpwd = rand();
        $new_encr_pwd = md5($newpwd);
        $message = "Your new password is $newpwd";
        mail($email, "Password Reset - Group S's Mobile App", $message);
        $sql = "UPDATE users SET password = '$new_encr_pwd' WHERE email = '$email'";

        if ($db->query($sql) === TRUE) {
            $update_state = "Password updated successfully!";
            $new_pass_info = "Your new password has been sent to: $email";
        } else {
            echo "<div>Error updating record: " . $db->error . "</div>";
        }
    }

    else {
        $no_such_email = "No such email found";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width-device-width, initial-scale-1.0">
    <link href="bootStrapCSS/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="login.css"/>
    <title>Log in Authentication Page</title>
</head>
<body>
<header>Smart Commute</header>
<main>
<div class="container text-center">
    <div class="row">
        <div class="col-12">
            <div class="header">
                <h1>Login to our website</h1>
                <p>In order to login to your account, please fill in the following</p>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <form class="needs-validation" novalidate action="" method="post">
                <div class="form-group row">
                    <div class="col-md-4 offset-md-4 mb-3">
                        <input type="text" class="form-control" name="email" id="email" placeholder="Email address" autocomplete="off" value="<?php echo $email; ?>" required>
                        <div class="invalid-feedback">Please, enter an email!</div>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="col-md-4 offset-md-4 mb-3">
                        <input type="password" class="form-control" name="password" id="password" placeholder="Password" autocomplete="off" value="<?php if(isset($_POST['Register'])){echo $_POST['password'];} ?>" required>
                        <div class="invalid-feedback">Please, enter a password!</div>
                    </div>
                </div>
                <div class="button">
                    <button type="submit" class="btn btn-outline-primary" name="LogIn">Log In</button>
                    <p>Don't remember your password? <button type="submit" class="btn btn-link small" name="pwdreset">Reset password</button></p>
                </div>
            </form>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <p>Don't have an account? <a href="register.php">Register here</a></p>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <p class="error"><?php echo $wrong_acc_info; ?></p>
            <p class="error"><?php echo $update_state; ?></p>
            <p class="error"><?php echo $new_pass_info; ?></p>
            <p class="error"><?php echo $no_such_email; ?></p>
        </div>
    </div>
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

