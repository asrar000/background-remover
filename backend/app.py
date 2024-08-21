from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from rembg import remove
from io import BytesIO
from PIL import Image

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes and origins

@app.route("/remove-background/", methods=["POST"])
def remove_background():
    try:
        # Check if a file is included in the request
        if 'file' not in request.files:
            return jsonify({"detail": "No file provided"}), 400

        file = request.files['file']

        # Check if the uploaded file is an image
        if not file.content_type.startswith("image/"):
            return jsonify({"detail": "File is not an image"}), 400

        # Read image bytes
        input_image = file.read()

        # Remove background
        output_image = remove(input_image)

        # Convert result to an image format for response
        image = Image.open(BytesIO(output_image))
        img_byte_arr = BytesIO()
        image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)

        # Return the image as a response
        return send_file(img_byte_arr, mimetype='image/png')

    except Exception as e:
        return jsonify({"detail": f"An error occurred: {str(e)}"}), 500
