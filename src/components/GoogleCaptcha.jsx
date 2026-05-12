import React from "react";
import { Modal, View } from "react-native";
import { WebView } from "react-native-webview";

const html = (siteKey) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://www.google.com/recaptcha/api.js"></script>
<script>
  function onData(token) {
    window.ReactNativeWebView.postMessage(token);
  }
</script>
</head>
<body style="display:flex;justify-content:center;align-items:center;height:100vh;">
<div class="g-recaptcha"
     data-sitekey="${siteKey}"
     data-callback="onData">
</div>
</body>
</html>
`;

export default function GoogleCaptcha({ visible, onVerify, onClose }) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1 }}>
        <WebView
          originWhitelist={["*"]}
          source={{ html: html("6LcSUIQsAAAAAEbsvXI2b5rPysA9k5R8wRluBew-") }} // 🔴 paste site key
          javaScriptEnabled
          onMessage={(event) => {
            const token = event.nativeEvent.data;
            onVerify(token);
            onClose();
          }}
        />
      </View>
    </Modal>
  );
}
