import React from "react";
import { Gantt } from "../src";
import { Warnings } from "./Warnings";

export default {
  title: "Warnings",
  component: Gantt,
};

const Template = (props: any) => <Warnings {...props} />;

export const WarningsStory = {
  name: "Warnings",
  render: (args: any) => <Template {...args} />,
};
