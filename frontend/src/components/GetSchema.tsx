import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';

// イントロスペクションクエリ用の型定義
interface TypeRef {
  name: string | null;
  kind: string;
  ofType: TypeRef | null;
}

interface InputValue {
  name: string;
  type: TypeRef;
}

interface Field {
  name: string;
  description: string | null;
  args: InputValue[];
  type: TypeRef;
}

interface SchemaType {
  name: string;
  fields: Field[] | null;
}

interface Schema {
  queryType: SchemaType;
  mutationType: SchemaType | null;
}

interface IntrospectionQueryData {
  __schema: Schema;
}

// イントロスペクションクエリ
const GET_SCHEMA_FIELDS = gql`
  query IntrospectionQuery {
    __schema {
      queryType {
        name
        fields {
          name
          description
          args {
            name
            type {
              name
              kind
              ofType {
                name
                kind
              }
            }
          }
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
      mutationType {
        name
        fields {
          name
          description
          args {
            name
            type {
              name
              kind
              ofType {
                name
                kind
              }
            }
          }
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  }
`;

const SchemaInspector: React.FC = () => {
  const { loading, error, data, refetch } = useQuery<IntrospectionQueryData>(GET_SCHEMA_FIELDS, {
    fetchPolicy: 'network-only', // キャッシュを無視して最新のスキーマを取得
  });

  // コンソール出力
  useEffect(() => {
    if (data) {
      const { queryType, mutationType } = data.__schema;

      console.log('利用可能なクエリ:');
      queryType.fields?.forEach((field) => {
        console.log(`- ${field.name} (${field.type.name || field.type.ofType?.name || field.type.kind})`);
        if (field.description) console.log(`  説明: ${field.description}`);
        if (field.args.length > 0) {
          console.log('  引数:');
          field.args.forEach((arg) => {
            console.log(`    - ${arg.name}: ${arg.type.name || arg.type.ofType?.name || arg.type.kind}`);
          });
        }
      });

      if (mutationType) {
        console.log('\n利用可能なミューテーション:');
        mutationType.fields?.forEach((field) => {
          console.log(`- ${field.name} (${field.type.name || field.type.ofType?.name || field.type.kind})`);
          if (field.description) console.log(`  説明: ${field.description}`);
          if (field.args.length > 0) {
            console.log('  引数:');
            field.args.forEach((arg) => {
              console.log(`    - ${arg.name}: ${arg.type.name || arg.type.ofType?.name || arg.type.kind}`);
            });
          }
        });
      } else {
        console.log('\nミューテーションは利用できません');
      }
    }
  }, [data]);

  // エラー出力
  useEffect(() => {
    if (error) {
      console.error('スキーマ取得エラー:', error.message);
    }
  }, [error]);

  // 型情報をフォーマット
  const formatType = (type: TypeRef): string => {
    if (type.name) return type.name;
    if (type.ofType) return `${type.kind === 'LIST' ? '[' : ''}${formatType(type.ofType)}${type.kind === 'LIST' ? ']' : ''}${type.kind === 'NON_NULL' ? '!' : ''}`;
    return type.kind;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">GraphQLスキーマインスペクター</h2>
      <button
        onClick={() => refetch()}
        disabled={loading}
        className={`mb-4 px-4 py-2 rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
      >
        {loading ? '読み込み中...' : 'スキーマを更新'}
      </button>

      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
          <p>エラー: {error.message}</p>
          <p>コンソールで詳細を確認するか、サーバー設定を確認してください。</p>
        </div>
      )}

      {data && (
        <div>
          <h3 className="text-xl font-semibold mb-2">クエリ ({data.__schema.queryType.name})</h3>
          {data.__schema.queryType.fields?.length === 0 ? (
            <p className="text-gray-600">利用可能なクエリはありません。</p>
          ) : (
            <ul className="space-y-4">
              {data.__schema.queryType.fields?.map((field) => (
                <li key={field.name} className="p-4 bg-gray-50 rounded shadow-sm">
                  <strong className="text-lg">{field.name}</strong> ({formatType(field.type)})
                  {field.description && <p className="text-gray-600 mt-1">{field.description}</p>}
                  {field.args.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium">引数:</p>
                      <ul className="list-disc pl-5">
                        {field.args.map((arg) => (
                          <li key={arg.name} className="text-gray-700">
                            {arg.name}: {formatType(arg.type)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          <h3 className="text-xl font-semibold mt-6 mb-2">
            ミューテーション ({data.__schema.mutationType?.name || 'なし'})
          </h3>
          {!data.__schema.mutationType ? (
            <p className="text-gray-600">利用可能なミューテーションはありません。</p>
          ) : data.__schema.mutationType.fields?.length === 0 ? (
            <p className="text-gray-600">利用可能なミューテーションはありません。</p>
          ) : (
            <ul className="space-y-4">
              {data.__schema.mutationType.fields?.map((field) => (
                <li key={field.name} className="p-4 bg-gray-50 rounded shadow-sm">
                  <strong className="text-lg">{field.name}</strong> ({formatType(field.type)})
                  {field.description && <p className="text-gray-600 mt-1">{field.description}</p>}
                  {field.args.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium">引数:</p>
                      <ul className="list-disc pl-5">
                        {field.args.map((arg) => (
                          <li key={arg.name} className="text-gray-700">
                            {arg.name}: {formatType(arg.type)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SchemaInspector;