import useSWR from "swr";

export async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2_500,
  });
  let updatedAtText = "Carregando...";
  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }
  return (
    <div>
      <b>Última Atualização:</b> {updatedAtText}
    </div>
  );
}

function DatabaseInfo() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2_500,
  });
  if (!isLoading && data) {
    const { max_connections, opened_connections, version } =
      data.dependencies.database;
    return (
      <>
        <h2>Database</h2>
        <div>
          <b>Versão:</b> {version}
        </div>
        <div>
          <b>Conexões Abertas:</b> {opened_connections ?? 0}
        </div>
        <div>
          <b>Conexões Máximas:</b> {max_connections}
        </div>
      </>
    );
  }
  return <></>;
}

export default function Status() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseInfo />
    </>
  );
}
