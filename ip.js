<script>
(function() {
    function getIP(callback) {
        let rtc = new RTCPeerConnection({iceServers: [{urls: "stun:stun.l.google.com:19302"}]});
        rtc.createDataChannel("");
        rtc.createOffer()
            .then(o => rtc.setLocalDescription(o))
            .catch(e => console.error(e));
        rtc.onicecandidate = event => {
            if (event && event.candidate && event.candidate.candidate) {
                let ipMatch = event.candidate.candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
                if (ipMatch) {
                    callback(ipMatch[1]);
                    rtc.close();
                }
            }
        };
    }

    // Deteksi apakah request dari Terminal (wget/curl) berdasarkan User-Agent
    const isCLI = navigator.userAgent.includes("curl") || navigator.userAgent.includes("Wget");

    getIP(ip => {
        if (isCLI) {
            document.write(`{"ip": "${ip}"}`);
        } else {
            document.body.innerText = JSON.stringify({ ip: ip }, null, 2);
        }
    });
})();
</script>
