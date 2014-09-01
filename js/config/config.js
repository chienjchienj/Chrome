var CONFIG = {
  sidebar_width: "180px",
  mixpanel_key:  "6739c9644606bc42c8ac134c22e1d691",
  version:       Env.getVersion(),
  active_icon:   "images/krake_icon_24.png",
  inactive_icon: "images/krake_icon_disabled_24.png",
  server_host:   "http://localhost:3000",
  paths: {
    create_new_path:  "/krakes/new",
    sign_in:          "/members/sign_in",
    sign_up:          "/members/sign_up",
    session_status:   "/members/session"
  }

};

/** Export for node testing **/
try { 
  module && (module.exports = CONFIG); 
} catch(e){}