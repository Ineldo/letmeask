import { useHistory } from 'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import GoogleiconImg from '../assets/images/google-icon.svg'
import { Button } from '../components/Button';
import { database } from '../services/firebase';

import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { FormEvent } from 'react';
import { useState } from 'react';




export function Home(){
   const history = useHistory();
   const {user, signInWIthGoogle } = useAuth()
   const [roomCode, setRoomCode] = useState('');

   async function handleCreateRoom(){
        if(!user){
          await  signInWIthGoogle();
        }
       
       history.push('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault(); 

        if(roomCode.trim()===''){
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if(!roomRef.exists()){
            alert('Room does not exist')
            return;
        }
    
        history.push(`/rooms/${roomCode}`);
        
    }

    return(
        <div id="page-auth">
            <aside>
            <img src={illustrationImg} alt="Ilustracao simbolizando perguntas e resposta"/>
                 <strong>Crie salas de Q&amp;A ao vivo</strong>
                 <p>Tire as duvidas da sua audiencia em tempo-real</p>
            </aside>
            <main>             
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={GoogleiconImg} alt="Logo do Google"/>
                        Crie a sua sala com o Google
                    </button>
                    <div className="separator"> ou entre em uma sala </div>
                   <form onSubmit={handleJoinRoom}>
                        <input 
                        type="text" 
                        placeholder="Digite o codigo da sala"
                        onChange={event => setRoomCode(event.target.value)}
                        value ={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala

                        </Button>
                   </form>
                </div>
            </main>
        </div>
    )
}