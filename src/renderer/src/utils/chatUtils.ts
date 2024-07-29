export type ReplaceBetweenParams = {
  start: number
  end: number
  img: string
  message: string
}

export function replaceBetween({
  start,
  end,
  img,
  message
}: ReplaceBetweenParams): string {
  return message.substring(0, start) + img + message.substring(end)
}

export function imgEmote(src: string) {
  return `<img style="display: inline-block; height: 1rem; width: auto;" src="${src}"/>` // h-4 corresponde a 18px
}

export function emoteURL(emoteId: string) {
  return `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/3.0`
}

export function sanitizeMessage(message: string): string {
  return message.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export function processMessage(
  message: string,
  extra?: any
): string {
  console.log("Cheguei aqui", { message, extra });

  let sanitizedMessage = sanitizeMessage(message);

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  sanitizedMessage = sanitizedMessage.replace(urlRegex, (url) => {
    return `<a href="${url}" style="color: #3B82F6; font-style: italic;" target="_blank">${url.substring(0, 25)}${url.length > 25 ? "..." : ""}</a>`;
  });

  const messageEmotes = extra?.emotes;
  if (messageEmotes) {
    const emotes = Object.keys(messageEmotes);
    for (const emote of emotes) {
      const emotePositions = messageEmotes[emote];
      for (const position of emotePositions) {
        const [start, end] = position.split('-').map(Number);
        const img = imgEmote(emoteURL(emote));
        sanitizedMessage = replaceBetween({
          start,
          end: end + 1,
          img,
          message: sanitizedMessage
        });
      }
    }
  }

  const marcacaoRegex = /@\b(\w+)\b/g;
  sanitizedMessage = sanitizedMessage.replace(marcacaoRegex, (_match, text) => {
    return `<span style="background-color: #9CA3AF; color: black; font-style: italic; padding: 1px 4px; border-radius: 0.375rem;">@${text}</span>`;
  });

  return sanitizedMessage;
}
