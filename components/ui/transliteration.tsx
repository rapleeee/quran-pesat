import React from "react";
import { Text, TextStyle } from "react-native";

interface TransliterationProps {
  text: string;
  style?: TextStyle;
}

interface TextPart {
  text: string;
  bold?: boolean;
  underline?: boolean;
}

function parseHtmlToparts(html: string): TextPart[] {
  const parts: TextPart[] = [];
  let remaining = html;

  // Regex to match <strong>, <u>, or plain text
  const tagRegex = /<(strong|u)>(.*?)<\/\1>|([^<]+)/g;
  let match;

  while ((match = tagRegex.exec(remaining)) !== null) {
    if (match[1] === "strong") {
      // Bold text
      parts.push({ text: match[2], bold: true });
    } else if (match[1] === "u") {
      // Underlined text
      parts.push({ text: match[2], underline: true });
    } else if (match[3]) {
      // Plain text
      parts.push({ text: match[3] });
    }
  }

  return parts;
}

export function Transliteration({ text, style }: TransliterationProps) {
  const parts = parseHtmlToparts(text);

  return (
    <Text style={style}>
      {parts.map((part, index) => (
        <Text
          key={index}
          style={[
            part.bold && { fontWeight: "bold" },
            part.underline && { textDecorationLine: "underline" },
          ]}
        >
          {part.text}
        </Text>
      ))}
    </Text>
  );
}
