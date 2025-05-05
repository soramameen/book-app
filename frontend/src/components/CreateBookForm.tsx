import { useForm } from 'react-hook-form'
import { useMutation, gql } from '@apollo/client';
import { useState } from 'react';

const CREATE_BOOK = gql`
    mutation CreateBook($input: CreateBookInput!) {
        createBook(input: $input) {
            id
            title
            author
            content
        }
    }
`;

const CreateBookForm = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [createBook, { loading, error }] = useMutation(CREATE_BOOK);
    const [successMessage, setSuccessMessage] = useState('');

    const onSubmit = async (data) => {
        try {
            const result = await createBook({
                variables: {
                    input: {
                        title: data.title,
                        author: data.author,
                        content: data.content
                    }
                }
            });
            
            // 成功時の処理
            setSuccessMessage(`「${result.data.createBook.title}」が正常に作成されました`);
            reset(); // フォームをリセット
        } catch (err) {
            console.error('Book creation error:', err);
            // エラーはuseMutationのerrorで自動的に捕捉される
        }
    };

    return (
        <div>
            <h2>新しい書籍を追加</h2>
            
            {successMessage && (
                <div>
                    {successMessage}
                </div>
            )}
            
            {error && (
                <div>
                    エラー: {error.message}
                </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="title">タイトル:</label>
                    <input
                        id="title"
                        type="text"
                        {...register('title', { 
                            required: 'タイトルは必須です',
                            maxLength: {
                                value: 100,
                                message: 'タイトルは100文字以内で入力してください'
                            }
                        })}
                    />
                    {errors.title && <p>{errors.title.message}</p>}
                </div>
                
                <div>
                    <label htmlFor="author">著者:</label>
                    <input
                        id="author"
                        type="text"
                        {...register('author', { 
                            required: '著者名は必須です',
                            maxLength: {
                                value: 50,
                                message: '著者名は50文字以内で入力してください'
                            }
                        })}
                    />
                    {errors.author && <p>{errors.author.message}</p>}
                </div>
                
                <div>
                    <label htmlFor="content">内容:</label>
                    <textarea
                        id="content"
                        {...register('content', { 
                            required: '内容は必須です',
                            minLength: {
                                value: 10,
                                message: '内容は最低10文字以上入力してください'
                            }
                        })}
                        rows="5"
                    />
                    {errors.content }
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? '送信中...' : '保存する'}
                </button>
            </form>
        </div>
    );
};

export default CreateBookForm;