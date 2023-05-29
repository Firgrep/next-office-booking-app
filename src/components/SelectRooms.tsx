
type selectRoomsProps = {
    rooms: undefined | any[],
    setRoom: React.Dispatch<React.SetStateAction<RoomType>>
}

export const SelectRooms: React.FC<selectRoomsProps> = ({rooms, setRoom}) => {

    const handleRoomSelection = (e: any) => {
        setRoom((prev) => ({ ...prev, roomId: e.target.value}))
    };

    return(
        <div>
            <select 
                className="select select-primary w-full max-w-xs mb-2" 
                defaultValue={"DEFAULT"}
                onChange={(e) => handleRoomSelection(e)}
            >
                <option disabled value="DEFAULT">Select room...</option>
                {rooms?.map(room => 
                    <option key={room.id} value={room.id}>{room.name}</option>    
                )}
            </select>
        </div>
    );
};
