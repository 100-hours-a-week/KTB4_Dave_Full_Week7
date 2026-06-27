export function parseJwtPayload(token) {
    const payloadBase64Url = token.split(".")[1];

    const payloadBase64 = payloadBase64Url
    .replace(/-/g, "+")
    .replace(/_/g, "/");

    const payloadJson = decodeURIComponent(
    atob(payloadBase64)
        .split("")
        .map(char => {
            return "%" + char.charCodeAt(0).toString(16).padStart(2, "0");
        })
        .join("")
  );

  return JSON.parse(payloadJson);
}

export function isJwtExpired(token) {
    if (!token) {
        return true;
    }

    try {
        const payload = parseJwtPayload(token);

        if (!payload.exp) {
            return true;
        }

        const now = Math.floor(Date.now() / 1000);

        return payload.exp <= now;
    } catch (error) {
        return true;
    }
}