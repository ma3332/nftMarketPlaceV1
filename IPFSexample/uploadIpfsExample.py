from pathlib import Path
import requests
import json
import os

# name, description, imageURI and attribute should be gotten from input in website

metadata_template = {
    "name": "",
    "description": "",
    "imageURI": "",
    "attribute": [{"trait_type": "from TTA", "value": 999}],
}


def upload_to_ipfs(filepath):
    # read file as binary (rb)
    with Path(filepath).open("rb") as fp:
        file_binary = fp.read()
        # upload ...
        # download command-line for IPFS (follow instructions: https://docs.ipfs.io/install/command-line/#official-distributions)
        # check out https://docs.ipfs.io/reference/kubo/api/#api-v0-add for code instruction
        # ipfs_url = "http://127.0.0.1:5001" -> ipfs daemon: running our own node -> then be able to upload
        # if our own node goes down, no one can see the NFT img or access NFT Metadata
        ipfs_url = "http://127.0.0.1:5001"
        endpoint = "/api/v0/add"
        response = requests.post(
            ipfs_url + endpoint,
            files={"file": file_binary},
            headers=None,
        )
        ipfs_hash = response.json()["Hash"]
        # "./img/1_Test.png" -> "1_Test.png"
        filename = filepath.split("/")[-1:][0]
        file_uri = f"https://ipfs.io/ipfs/{ipfs_hash}?filename={filename}"
        print(file_uri)
        return file_uri


def main_for_upload_IPFS():
    list_file = os.listdir("./img")
    image_name = [x.split(".")[0] for x in list_file]
    metadata_file_name_path = f"./metadata/{image_name}.json"
    collectible_metadata = metadata_template
    if Path(metadata_file_name_path).exists():
        print(f"{metadata_file_name_path} already exists! Delete it to overwrite")
    else:
        print(f"Creating Metadata file: {metadata_file_name_path}")
        collectible_metadata["name"] = image_name
        collectible_metadata["description"] = f"{image_name} HD District"
        image_path = "./img/" + image_name + ".jpg"
        # (1) upload image to ipfs
        image_uri = upload_to_ipfs(image_path)
        collectible_metadata["imageURI"] = image_uri
        with open(metadata_file_name_path, "w") as file:
            json.dump(collectible_metadata, file)
        ipfs_metadata_link = upload_to_ipfs(metadata_file_name_path)
        # open("path", "a"): write append to a file
        # open("path", "w"): write on to a file
        # open("path", "r"): read a file
        # open("path", "rb"): read a file as binary form
        # (2) upload metadata to ipfs
        with open("./metadata/metadata_link.txt", "a") as f:
            print(ipfs_metadata_link, file=f)


def main():
    main_for_upload_IPFS()  # need to execute this function 1st to create metadata json file
