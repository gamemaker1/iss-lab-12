from pydantic import BaseModel

class Item(BaseModel): # addedBaseModel
    name: str
    description: str

class User(BaseModel):
    username: str
    bio: str
    
    # You can raise your hands and give the answer to the chocolate question
