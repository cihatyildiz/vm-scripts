import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import theme from 'web-app/themes/Basic.theme'

export default function PlatformSnackbar ( { message } ) {
  const [ open, setOpen ] = React.useState( true );
  function handleClose ( event, reason ) {
    if ( reason === "clickaway" ) {
      return;
    }
    setOpen( false );
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={message}
        action={[
          <IconButton key="close" onClick={handleClose} style={{
          }}>
            <CloseIcon />
          </IconButton>
        ]}
      />
    </div>
  );
}
