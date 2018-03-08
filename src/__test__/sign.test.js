import { encrypt, decrypt } from "../sign"

const data = {
  url:
    "https://r2---sn-ogueln7k.googlevideo.com/videoplayback?initcwndbps=501250&mime=audio/mp4&ipbits=0&fvip=2&itag=140&clen=3116697&requiressl=yes&signature=5675F1814D5864C351EC656F635B5060CD956397.05D93B42DC4FC2797922802FC260C6DB3300A978&mm=31,29&mn=sn-ogueln7k,sn-ogul7n7d&id=o-AN1SCybNC8SlIRQP3fKsQZ7TD7_Tb9sUkOCefweYpwGs&source=youtube&mv=m&keepalive=yes&ei=QAOgWsyBNIHKgAP2_IOADw&ms=au,rdu&ip=45.76.211.250&lmt=1513315032948526&dur=196.185&pl=26&mt=1520435876&sparams=clen,dur,ei,gir,id,initcwndbps,ip,ipbits,itag,keepalive,lmt,mime,mm,mn,ms,mv,pl,requiressl,source,expire&expire=1520457632&gir=yes&c=WEB&key=yt6&signature=5675F1814D5864C351EC656F635B5060CD956397.05D93B42DC4FC2797922802FC260C6DB3300A978"
}

const token = encrypt(JSON.stringify(data))
console.log("[token]", token)
const decode = decrypt(token)
console.log("[decode]", decode)
