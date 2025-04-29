import React from "react";
import Street_right_down from "./Street_right_down";
import Street_left_down from "./Street_left_down";

export default function Street({
  direction,
  style,
}: {
  direction: "left" | "right";
  style?: any;
}) {
  if (direction === "left") return <Street_left_down style={style} />;
  return <Street_right_down style={style} />;
}
