cd $FE_DIR && npm run build --prefix && rm -r $VITE_APP_DEPLOY_DIR/* && cp -r $FE_DIR/dist/* $VITE_APP_DEPLOY_DIR &
cd ./be && node ./dist/main.js
