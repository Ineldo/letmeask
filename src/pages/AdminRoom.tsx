import { database } from '../services/firebase';
import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import {Button} from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import {useHistory, useParams} from 'react-router-dom';

import'../styles/room.scss';
//import { useState, FormEvent } from 'react';
//import { useAuth } from '../hooks/useAuth';
//import { database } from '../services/firebase';
import { Questions } from '../components/Questions';
import { useRoom } from '../hooks/useRoom';





type RoomParams={
    id: string;
}

export function AdminRoom(){
    const params = useParams<RoomParams>(); 
    const roomId = params.id;
   // const {user}= useAuth();
   const history = useHistory();
    
    const { title,questions}=useRoom(roomId);

    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        });

        history.push('/');
    }

   async function handleDeleteQuestion(questionId: string){
       if(window.confirm('Eliminar??')) {
         await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
       }

    }
    
  

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                        <div>
                            <RoomCode code={roomId}/>
                            <Button isOutlined onClick={handleEndRoom}>Encerar sala</Button>
                        </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} perguntas</span>}
                    
                </div>

              
                <div className="question-list">
                    {questions.map(question =>{
                        return(
                            <Questions
                            key={question.id}
                            content={question.content}
                            author={question.author}
                            >
                                <button
                                type="button"
                                onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                         </Questions>
                        );
                    })}  
                </div>
               
            </main>
        </div>
    );
}