import {RiArrowDropDownLine} from 'react-icons/ri'
import {MdOutlineDelete} from 'react-icons/md'
import {BiEdit} from 'react-icons/bi'
import {formatDistanceToNow} from 'date-fns'
import './index.css'

const NoteItem = (props) => {
    const {noteDetails, showNote, deleteNote, editNote} = props
    const {id, createdAt, title, description, opened, updated, lastUpdated} = noteDetails

    const note = description.split('\n').map(e => e)

    const createdTimeDistance = formatDistanceToNow(new Date(createdAt.seconds * 1000))
    const lastUpdatedTimeDistance = updated ? formatDistanceToNow(new Date(lastUpdated.seconds * 1000)) : null

    const arrowClass = opened ? 'arrow-icon opened' : 'arrow-icon'
    const updatedStatus = updated ? "(Edited)" : ""

    const onOpenNote = () => {
        showNote(id)
    }

    const onDeleteNote = () => {
        deleteNote(id)
    }

    const onEditNote = () => {
        editNote(id)
    }

    return(
        <li className='note-item-delete-icon-box'>
            <div className='note-item'>
                <div className='note-header-box' onClick={onOpenNote}>
                <h5 className='note-title'>
                        {title}
                        <span className='note-time'>({createdTimeDistance} ago)
                            <span className='updated-status'>{updatedStatus}</span>
                        </span>
                    </h5>
                    <RiArrowDropDownLine className={arrowClass} />
                </div>
                {opened ? (
                    <div className='note-bottom-box'>
                        {/* <p className='note-description'>{description}</p> */}
                        {note.map(e => (<p className='note-description' key={e}>{e}</p>))}
                        {lastUpdatedTimeDistance ? 
                            <p className='last-update-time'>{`last updated ${lastUpdatedTimeDistance} ago`}</p>
                        : null}
                    </div>
                ) : null}
            </div>
            <BiEdit title="edit note" className='note-del-icon' onClick={onEditNote} />
            <MdOutlineDelete title='delete note' className='note-del-icon' onClick={onDeleteNote} />
        </li> 
    )
}

export default NoteItem