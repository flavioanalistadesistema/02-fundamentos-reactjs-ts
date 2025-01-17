import { format, formatDistanceToNow } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { useState, FormEvent, ChangeEvent, InvalidEvent } from 'react';

import { Avatar } from "./Avatar";
import { Comment } from "./Comment";
import styles from "./Post.module.css";

interface Content {
    type: string
    content: string
}

interface Author {
    avatarUrl: string
    name: string
    role: string
}

interface PostProps {
    author: Author
    publishedAt: Date
    content: Content[]
}


export function Post({ author, publishedAt, content }: PostProps) {
    const [comment, setComment] = useState(['Bem vindo'])
    const [commentNewText, setCommentNewText] = useState('')

    const publishedDateFormatted = format(publishedAt, "d 'de' MMMM 'as' HH':'mm", {
        locale: ptBR
    })

    const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
        locale: ptBR,
        addSuffix:true
    })    

    function hasCreatNewComment(event: FormEvent) {
        event.preventDefault();
        setComment([...comment, commentNewText])
        setCommentNewText('')        
    }

    function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity('Campo obrigatorio teste')
    }

    function handleNewCommentText(event: ChangeEvent<HTMLTextAreaElement>) {      
        event.target.setCustomValidity('')  
        setCommentNewText(event.target.value)
    }

    function deleteComment(commentToDelete: string) {
        const commentWithoutDeleteOn = comment.filter(comment => {
            return comment !== commentToDelete;
        })
        setComment(commentWithoutDeleteOn)
    }

    const isNewCommentEmpty = commentNewText.length === 0

  return (
    <article className={styles.post}>
        <header>
            <div className={styles.author}>
                <Avatar src={author.avatarUrl}/>
                <div className={styles.authorInfo}>
                    <strong>{author.name}</strong>
                    <span>{author.role}</span>
                </div>
            </div>
            <time title={publishedDateFormatted} dateTime={publishedAt.toISOString()}>
                {publishedDateRelativeToNow}
            </time>
        </header>
        <div className={styles.content}>
            {content.map(line => {
                if (line.type === 'paragraph') {
                    return <p key={line.content} >{line.content}</p>
                }else if (line.type === 'link') {
                    return <p key={line.content} ><a href="">{line.content}</a></p>
                }
            })} 
        </div>

        <form onSubmit={hasCreatNewComment} className={styles.commentForm}>
            <strong>Deixe seu feedback</strong>

            <textarea 
                name='content'
                value={commentNewText}
                placeholder="Deixe um comentário"
                onChange={handleNewCommentText}
                onInvalid={handleNewCommentInvalid}
                required
            />
            <footer>
                <button type="submit" disabled={isNewCommentEmpty}>Publicar</button>
            </footer>
        </form>
        <div className={styles.commentList}>
            {comment.map(comment => {
                return (
                <Comment 
                    onDeleteComment={deleteComment}
                    key={comment}  
                    content={comment}
                />
            )
            })}           
        </div>
    </article>
  );
}
