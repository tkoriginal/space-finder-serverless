import { ChangeEvent, FC, SyntheticEvent, useState } from "react";
import { Space } from "../../model/Model";
import { DataService } from "../../services/DataService";

interface CreateSpaceProps {
  dataService: DataService
}

export interface CreateSpaceState {
  name?: string,
  location?: string,
  description?: string,
  photoUrl?: string,
  photo?: File
}
const CreateSpace:FC<CreateSpaceProps> = ({dataService}) => {
  const [spaceData, setSpaceData] = useState<CreateSpaceState>({})

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    try {
      const id = await dataService.createSpace(spaceData)
      alert(`Create space with ${id}`)
    } catch (error) {
      console.log(error)
    }
  }
  
  const setPhotoUrl = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSpaceData(prev => ({ ...prev, photo: event.target.files![0]}))
    }
  }

  return (
    <form onSubmit={e => handleSubmit(e)}>
      <label>Name:  <br />
        <input name="space name" value={spaceData.name} onChange={e => setSpaceData(prev => ({ ...prev, name: e.target.value}))} />
      </label><br />
      <label>Location:  <br />
        <input name="space location" value={spaceData.location} onChange={e => setSpaceData(prev => ({ ...prev, location: e.target.value}))} />
      </label><br />
      <label>Description: <br />
        <input name="space description" value={spaceData.description} onChange={e => setSpaceData(prev => ({ ...prev, description: e.target.value}))} />
      </label> <br />
      <label>Photo:  <br />
        <input name="space photo" type="file" onChange={e => setPhotoUrl(e)} />
      </label>
      <hr />
      <input data-test="submit-button" type="submit" value="Create space" />
    </form>
  )
}

export default CreateSpace