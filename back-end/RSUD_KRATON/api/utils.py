# import requests

# CLIENT_ID = '1a2a28a3-79e5-4d57-a687-5ad6822a348d_d302e924-3bbc-4e88-b77e-f881d706668f'
# CLIENT_SECRET =  'wN5EJEsj7eLCkNTouQqwBh2c2pq0lI3mgJ2TpJFkmtY='

# def get_icd_token():
#     url = "https://icdaccessmanagement.who.int/connect/token"
#     data = {
#         "client_id": CLIENT_ID,
#         "client_secret": CLIENT_SECRET,
#         "scope": "icdapi_access",
#         "grant_type": "client_credentials"
#     }
#     response = requests.post(url, data=data)
#     return response.json().get("access_token")

# def get_icd_entity(code):
#     token = get_icd_token()
#     headers = {"Authorization": f"Bearer {token}"}
#     url = f"https://id.who.int/icd/entity/{code}"
#     response = requests.get(url, headers=headers)
#     return response.json()