import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

type Icon = {
  icon: React.ReactElement<IconProps>;
  className?: string;
  id?: string;
} & IconProps;

function Icon({ icon, className, id, ...props }: Icon) {
  return React.cloneElement(icon, {
    className,
    id,
    ...props,
  });
}

export default Icon;
