import logoImg from '../assets/images/logo.svg'
import {Button} from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import {useParams} from 'react-router-dom';

import'../styles/room.scss';
import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

type FirebaseQuestions= Record<string, {
    author:{
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;

}>

type Question = {
    id: string;
    author:{
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}

type RoomParams={
    id: string;
}

export function Rooms(){
    const {user}= useAuth();
    const params = useParams<RoomParams>(); 
    const roomId = params.id;
    const [newQuestion, setNewQuestion]= useState('');
    const [questions, setQuestion]= useState<Question[]>([]);
    const [title, setTitle]= useState('');

    useEffect(()=>{
            const roomRef= database.ref(`rooms/${roomId}`)

            roomRef.on('value', room=>{ 
                const databaseRoom = room.val();
                const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
                const parsedQuestion= Object.entries(firebaseQuestions).map(([key, value])=>{
                    return{
                        id: key,
                        content: value.content,
                        author:value.author,
                        isHighlighted: value.isHighlighted,
                        isAnswered: value.isAnswered,
                    }

                })
                setTitle(databaseRoom.title);
                setQuestion(parsedQuestion)
            })
         }, [roomId])

    async function handleSendQuestion(event: FormEvent){
        event.preventDefault();
        if(newQuestion.trim()===''){
            return;
        }
    
        if(!user){
            throw new Error('Precisa estar logado')   //can use react-hot=toast to customize alerts 
        }

        const question={
            content : newQuestion,
            author:{
                name:user?.name,
                avatar: user.avatar,
            },
            isHighlighted: false,
            isAnswered: false,
        };
     await database.ref(`rooms/${roomId}/questions`).push(question);
     setNewQuestion('');
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                        <div>codigo</div>
                        <RoomCode code={roomId}/>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} perguntas</span>}
                    
                </div>

                <form onSubmit= {handleSendQuestion}>
                    <textarea
                        placeholder="O que vc quer perguntar"
                        onChange={event => setNewQuestion(event.target.value)}
                        value= {newQuestion}
                    />
                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>
                            Para enviar um pergunta, <button>faca seu login</button>.</span>
                        )}
                      
                        <Button type="submit" disabled={!user}>Enviar Pergunta</Button>
                    </div>
                </form>
                {JSON.stringify(questions)}
            </main>
        </div>
    );
}