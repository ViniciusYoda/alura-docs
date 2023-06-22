import io from "./servidor.js"
import { documentosColecao } from "./dbConnect.js"


io.on("connection", (socket) => {
   console.log("Um cliente se conectou! ID:", socket.id)

   socket.on("selecionar_documento", async (nomeDocumento, devolverTexto) => {
      socket.join(nomeDocumento)

      const documento = await encontrarDocumento(nomeDocumento);

      if (documento) {
         devolverTexto(documento.texto);
      }
   });

   socket.on("texto_editor", async ({texto, nomeDocumento}) => {
      const documento = await encontrarDocumento(nomeDocumento);

      if (documento) {
         documento.texto = texto;

         socket.to(nomeDocumento).emit("texto_editor_clientes", texto);
      }
   });
});

function encontrarDocumento(nome) {
   const documento = documentosColecao.findOne({
      nome
   })

   return documento;
}
