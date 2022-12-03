import os
from google.cloud import storage


gcp_project = os.environ["GCP_PROJECT"]
bucket_name = "fuzzy-mark-data-bucket"
persistent_folder = "/persistent"


def download_blob(bucket_name, source_blob_name, destination_file_name):
    """Downloads a blob from the bucket."""

    storage_client = storage.Client(project=gcp_project)

    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)
    blob.download_to_filename(destination_file_name)


print(gcp_project)

# Test access
download_files = ["data_title.pkl","finalcheckpoint19.pth","papers_with_abstract"]
# download_file = "authors.csv"
for i,download_file in enumerate(download_files):
    print(download_files[i])
    download_blob(bucket_name, download_files[i],
            os.path.join(persistent_folder, download_files[i]))