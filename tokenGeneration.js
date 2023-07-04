const {
  RtcTokenBuilder,
  RtmTokenBuilder,
  RtcRole,
  RtmRole,
} = require("agora-access-token");

const appId = "aa6bd939aae94c179e8fb5f7ab619222";
const appCertificate = "ce284162ba00456aa49d6b0f1c1b4c50";
// const channelName = "test";
const uid = 0;
const role = RtcRole.PUBLISHER;
const expirationTimeInSeconds = 86400;
const currentTimestamp = Math.floor(Date.now() / 1000);
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
// Build token with uid

function generateToken(channelName) {
  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );
  return token;
}

module.exports = { generateToken, privilegeExpiredTs };
