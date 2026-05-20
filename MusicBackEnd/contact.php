<?php
// contact.php
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Contact Us – WhipUp Player</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: system-ui, sans-serif; padding: 20px; background:#050512; color:#f5f5ff; }
    h1 { margin-bottom: 1rem; }
    form { max-width: 480px; background:#101020; padding: 1.5rem; border-radius: 12px; }
    label { display:block; margin-top:0.75rem; margin-bottom:0.25rem; }
    input, textarea { width:100%; padding:0.5rem; border-radius:6px; border:1px solid #333; background:#0a0a18; color:#f5f5ff; }
    button { margin-top:1rem; padding:0.5rem 1rem; border:none; border-radius:999px; background:#ff4b8b; color:#fff; cursor:pointer; }
    button:hover { background:#ff73a5; }
    .note { margin-top:1rem; font-size:0.9rem; color:#9a9ab5; }
  </style>
</head>
<body>
  <h1>Contact Us</h1>
  <form action="save_message.php" method="post">
    <label for="name">Name</label>
    <input required type="text" id="name" name="name" maxlength="100">

    <label for="email">Email</label>
    <input required type="email" id="email" name="email" maxlength="150">

    <label for="message">Message</label>
    <textarea required id="message" name="message" rows="5"></textarea>

    <button type="submit">Send Message</button>
  </form>

  <p class="note">
    This form stores submissions in a MySQL database (PHP + DB integration).
  </p>
</body>
</html>
