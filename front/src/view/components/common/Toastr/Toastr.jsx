import { Message, useToaster } from "rsuite";
import React from "react";

const Toastr = () => {
  const toaster = useToaster();

  const showToast = (text, type, header = undefined) => {
    const message = (
      <Message showIcon type={type} header={header}>
        {text}
      </Message>
    );

    toaster.push(message, {
      placement: "topEnd",
      duration: 3000,
    });
  };

  return { showToast };
};

export default Toastr;
