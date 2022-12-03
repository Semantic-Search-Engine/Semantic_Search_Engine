import os
from google.cloud import storage


gcp_project = "My First Project"
bucket_name = "sse_app"
persistent_folder = "/persistent"


def download_blob(bucket_name, source_blob_name, destination_file_name):
    """Downloads a blob from the bucket."""

    storage_client = storage.Client(project=gcp_project)

    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)
    blob.download_to_filename(destination_file_name)


print(gcp_project)
print("Downloading required files from bucket to persistent folder")

# Test access
download_file = ["data_abstract.pkl","data_title.pkl","finalcheckpoint19.pth"]
for i in download_file:
    print(i)
    download_blob(bucket_name, i,
                os.path.join(persistent_folder, i))