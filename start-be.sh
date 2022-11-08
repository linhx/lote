# check start mode is rebuild FE or the deploy dir is empty (did not deploy at all)
if [ "$START_MODE" == "rebuild-fe" ] || [ -z "$(ls -A $VITE_APP_DEPLOY_DIR)" ]
then
  cd $FE_DIR && npm run build
  rm -rf $VITE_APP_DEPLOY_DIR/*
  cp -r $FE_DIR/dist/* $VITE_APP_DEPLOY_DIR
fi

cd $BE_DIR && node ./dist/main.js
