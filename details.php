<?php
session_start();
$name = $_SESSION['name'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width-device-width, initial-scale-1.0">
    <link href="bootStrapCSS/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
    <link href="CSS/details.css" rel="stylesheet">
    <meta charset="UTF-8">
    <title>Account Details</title>
</head>
<body>
<header>Smart Commute</header>
<main>
<div class="container">
    <h2>Account details</h2>
    <form>
        <table class="table table-hover">
            <tbody>
<!--            --><?php
            /**
             * Created by IntelliJ IDEA.
             * User: Hristo Petkov
             * Date: 11/20/2018
             * Time: 8:11 PM
             */

            //Connect to the database
            $host = "devweb2018.cis.strath.ac.uk";
            $username = "cs317mads";
            $dbPass = "Te5IathaejiT";
            $dbName = "cs317mads";

            $db = new mysqli($host, $username, $dbPass, $dbName);

            $id = $_SESSION["id"];
            $sql2 = "SELECT * FROM users WHERE id = '$id'";
            $result2 = $db->query($sql2);
            while($row = $result2->fetch_assoc()){
                echo "<tr>";
                echo "<td><b>Account ID </b></td><td>".$row["id"]."</td><td></td>";
                echo "</tr>\n";
                echo "<tr>";
                echo "<td><b>Username </b></td><td>".$row["username"]."</td><td><button type='button' class='btn btn-link' data-target='#editNamePage'  data-toggle='modal'>Edit</button></td>";
                echo "</tr>\n";
                echo "<tr>";
                echo "<td><b>Email </b></td><td>".$row["email"]."</td><td><button type='button' class='btn btn-link' data-target='#editEmailPage'  data-toggle='modal'>Edit</button></td>";
                echo "</tr>\n";
                echo "<td><b>Password </b></td><td>...</td><td><button type='button' class='btn btn-link' data-target='#editPasswordPage'  data-toggle='modal'>Edit</button></td>";
                echo "</tr>\n";
//                if($_SESSION['user-type'] === "owner")
//                {
//                    echo "<tr>";
//                    echo "<td><b>Institute </b></td><td>".$row["institute"]."</td><td><button type='button' class='btn btn-link' data-target='#editInstitutionPage'  data-toggle='modal'>Edit</button></td>";
//                    echo "</tr>\n";
//                }


//                echo "<td>".$size."</td>\n";
//                echo "<td>".$rowz["price"]."</td>\n";
//                echo "<td><input type='submit' value='More' name='$str'/></td>\n";
//                echo "<td><input type='submit' value='Order' name='$id'/></td>\n";
//                echo "</tr>\n";
            }
            echo "</table>";


            ?>
            </tbody>
        </table>
    </form>
    <div class="modal fade" role="dialog" id="editNamePage" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h6 class="modal-title">Edit Details</h6>
                </div>
                <div class="modal-body">
                    <form action="details.php" method="post">
                        <div class="form-group">
                            Username: <input type="text" class="form-control" name="newname" placeholder="Enter new username"/>
                        </div>
                        <div class="form-group">
                            Confirm Username: <input type="text" class="form-control" name="conname" placeholder="Confirm your username"/>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" name="editname" class="btn btn-outline-primary" >Edit</button>
                            <button class="btn btn-outline-primary" data-dismiss="modal">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" role="dialog" id="editEmailPage" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h6 class="modal-title">Edit Details</h6>
            </div>
            <div class="modal-body">
                <form action="details.php" method="post">
                    <div class="form-group">
                        New Email: <input type="text" class="form-control" name="newmail" placeholder="Enter new email"/>
                    </div>
                    <div class="form-group">
                        Confirm Email: <input type="text" class="form-control" name="confmail" placeholder="Confirm your email"/>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" name="editemail" class="btn btn-outline-primary">Edit</button>
                        <button class="btn btn-outline-primary" data-dismiss="modal">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

    <div class="modal fade" role="dialog" id="editPasswordPage" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h6 class="modal-title">Edit Details</h6>
                </div>
                <div class="modal-body">
                    <form action="details.php" method="post">
                        <div class="form-group">
                            Password: <input type="text" class="form-control" name="newpass" placeholder="Enter new password"/>
                        </div>
                        <div class="form-group">
                            Confirm Password: <input type="text" class="form-control" name="confpass" placeholder="Confirm your password"/>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" name="editpassword" class="btn btn-outline-primary" >Edit</button>
                            <button class="btn btn-outline-primary" data-dismiss="modal">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

<div class="modal fade" role="dialog" id="editInstitutionPage" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h6 class="modal-title">Edit Details</h6>
            </div>
            <div class="modal-body">
                <form action="details.php" method="post">
                    <div class="form-group">
                        New Institution: <input type="text" class="form-control" name="newInstitution" placeholder="Enter new Institution"/>
                    </div>
                    <div class="form-group">
                        Confirm Institution: <input type="text" class="form-control" name="confInstitution" placeholder="Confirm your Institution"/>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" name="editInstitution" class="btn btn-outline-primary">Edit</button>
                        <button class="btn btn-outline-primary" data-dismiss="modal">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<div>

    <div class="button">
        <a href="Home.html"><button type="submit" class="btn btn-outline-primary" name="home">Home Page</button></a>
    </div>
    <?php
    if(isset($_POST['editname']))
    {
        $newName = isset($_POST["newname"])? mysqli_real_escape_string($db, $_POST["newname"]): "";
        $confName = isset($_POST["conname"])? mysqli_real_escape_string($db, $_POST["conname"]): "";

        if($newName === $confName){
            $sql = "UPDATE cs317mads.`users` SET username = '$confName' WHERE id = '$id'";
            $result = $db->query($sql);
            if($result){
                echo "<p style='text-align: center'>Name changed successfully, please refresh page to view results</p>";
                $_SESSION['name'] = $confName;
            }else{
                echo "<p style='text-align: center'>Change failed</p>";
            }
        }else{
            echo "<p style='text-align: center'>Names don't match, please try again</p>";
        }
    }

    elseif(isset($_POST['editemail'])){

        $newEmail = isset($_POST["newmail"])? mysqli_real_escape_string($db, $_POST["newmail"]): "";
        $confEmail = isset($_POST["confmail"])? mysqli_real_escape_string($db, $_POST["confmail"]): "";

        if(($newEmail === $confEmail) && filter_var($confEmail, FILTER_VALIDATE_EMAIL)){
            $sql3 = "UPDATE cs317mads.`users` SET email = '$confEmail' WHERE id = '$id'";
            $result3 = $db->query($sql3);
            if($result3){
                echo "<p style='text-align: center'>Email changed successfully, please refresh page to view results</p>";
                $_SESSION['email'] = $confEmail;
            }else{
                echo "<p style='text-align: center'>Change failed</p>";
            }
        }else{
            echo "<p style='text-align: center'>Emails don't match or are not valid, please try again</p>";
        }
    }

    elseif(isset($_POST['editpassword'])){
        $newpass = isset($_POST['newpass'])? mysqli_real_escape_string($db, $_POST['newpass']): "";
        $confpass = isset($_POST['confpass'])? mysqli_real_escape_string($db, $_POST['confpass']): "";
        $encryptPass = md5($confpass);

        if($newpass === $confpass){
            $sql4 = "UPDATE cs317mads.`users` SET password = '$encryptPass' WHERE id = '$id'";
            $result4 = $db->query($sql4);
            if($result4){
                echo "<p style='text-align: center'>Password changed successfully, please refresh page to view results</p>";
                $_SESSION['password'] = $confpass;
            }else{
                echo "<p style='text-align: center'>Change failed</p>";
            }
        }else{
            echo "<p style='text-align: center'>Passwords don't match, please try again</p>";
        }
    }
    ?>
</div>
</div>
</main>
<footer>Created by Group S 2019</footer>
<script src="bootStrapJavaScript/jquery-3.3.1.min.js"></script>
<script src="bootStrapJavaScript/bootstrap.min.js"></script>

</body>
</html>