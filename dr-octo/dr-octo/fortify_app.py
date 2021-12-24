from flask import Flask, jsonify
from flask_restplus import Resource, Api
from apis.fortify.FortifyPushFPR import fortify_push_fpr

app = Flask(__name__)

app.register_blueprint(fortify_push_fpr)
api = Api(app)


@api.route('/hello')
class HelloWorld(Resource):
  def get(self):
    return 'foritfy-app from dr-octopus'


if __name__ == '__main__':
    app.run(debug = True, host = '0.0.0.0')
