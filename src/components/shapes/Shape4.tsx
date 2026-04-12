import { SVGProps } from "react";

export default function Shape4({ fill = "#00AD4F", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="87" height="83" viewBox="0 0 87 83" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M71.6863 0C64.4363 0 58.3563 12.17 56.7363 28.53C31.7263 -0.210001 13.8063 12.36 32.2563 45.67C16.3263 41.59 2.81632 43.14 0.336324 49.96C-5.35368 69.55 62.9363 94.49 70.4163 74.95C70.6963 74.8 70.9663 74.61 71.2063 74.4C92.1363 74.04 92.0263 1.33 71.6863 0Z" fill={fill} />
    </svg>
  );
}
