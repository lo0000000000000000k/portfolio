'use client';
import { useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Materials ───────────────────────────────────────────── */
const MAT = {
  wood:    { color:'#a0622a', roughness:0.75, metalness:0.05 },
  darkWood:{ color:'#5c3310', roughness:0.85, metalness:0.0  },
  wall:    { color:'#1e2840', roughness:0.95, metalness:0.0  },
  floor:   { color:'#3d2614', roughness:0.85, metalness:0.06 },
  ceil:    { color:'#151b2e', roughness:1,    metalness:0.0  },
  silver:  { color:'#b0b0b0', roughness:0.35, metalness:0.75 },
  black:   { color:'#1a1a1a', roughness:0.55, metalness:0.25 },
  screen:  { color:'#0a1628', roughness:0.15, metalness:0.5, emissive:'#004499', emissiveIntensity:1.5 },
  purple:  { color:'#7c4dcf', roughness:0.35, metalness:0.45 },
  cream:   { color:'#f5e8c8', roughness:0.85, metalness:0    },
  green:   { color:'#2d6a27', roughness:0.75, metalness:0    },
  red:     { color:'#8b1a1a', roughness:0.7,  metalness:0    },
  blue:    { color:'#1a3a6b', roughness:0.7,  metalness:0    },
  lamp:    { color:'#f5c842', roughness:0.25, metalness:0, emissive:'#f5c842', emissiveIntensity:2.0 },
  chess_w: { color:'#ede0c4', roughness:0.5,  metalness:0.15 },
  chess_b: { color:'#1a0e05', roughness:0.45, metalness:0.25 },
  rug:     { color:'#4a2870', roughness:0.95, metalness:0    },
  fabric:  { color:'#2c3e6b', roughness:0.95, metalness:0    },
  cushion: { color:'#1e2d50', roughness:0.9,  metalness:0    },
};

function M({ c }: { c: keyof typeof MAT }) {
  const m = MAT[c];
  return <meshStandardMaterial {...m} />;
}

/* ─── Room Shell ─────────────────────────────────────────── */
export function RoomShell() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-2.2,0]} receiveShadow>
        <planeGeometry args={[18,13]}/>
        <M c="floor"/>
      </mesh>
      {/* Rug */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-2.19,0]} receiveShadow>
        <planeGeometry args={[10,7]}/>
        <M c="rug"/>
      </mesh>
      {/* Back wall */}
      <mesh position={[0,1.5,-6.5]} receiveShadow>
        <planeGeometry args={[18,9]}/>
        <M c="wall"/>
      </mesh>
      {/* Left wall */}
      <mesh rotation={[0,Math.PI/2,0]} position={[-9,1.5,0]} receiveShadow>
        <planeGeometry args={[13,9]}/>
        <M c="wall"/>
      </mesh>
      {/* Right wall */}
      <mesh rotation={[0,-Math.PI/2,0]} position={[9,1.5,0]} receiveShadow>
        <planeGeometry args={[13,9]}/>
        <M c="wall"/>
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI/2,0,0]} position={[0,4.5,0]}>
        <planeGeometry args={[18,13]}/>
        <M c="ceil"/>
      </mesh>
      {/* Wall shelf left */}
      <mesh position={[-6.5,1.5,-5.5]}>
        <boxGeometry args={[3,0.1,0.5]}/>
        <M c="darkWood"/>
      </mesh>
    </group>
  );
}

/* ─── Desk + Chair ───────────────────────────────────────── */
export function Desk() {
  return (
    <group position={[-1,-0.5,-2]}>
      {/* Desktop surface */}
      <mesh position={[0,0,0]} castShadow receiveShadow>
        <boxGeometry args={[5.5,0.12,2.2]}/>
        <M c="wood"/>
      </mesh>
      {/* Legs */}
      {([[-2.5,-0.9,-0.95],[2.5,-0.9,-0.95],[-2.5,-0.9,0.95],[2.5,-0.9,0.95]] as [number,number,number][]).map((p,i)=>(
        <mesh key={i} position={p} castShadow>
          <boxGeometry args={[0.1,1.8,0.1]}/>
          <M c="darkWood"/>
        </mesh>
      ))}
      {/* Back panel */}
      <mesh position={[0,-0.9,0.95]}>
        <boxGeometry args={[5.5,1.78,0.04]}/>
        <M c="darkWood"/>
      </mesh>
    </group>
  );
}

export function Chair() {
  return (
    <group position={[-1,-2.2,0.8]}>
      {/* Seat */}
      <mesh position={[0,0.9,0]} castShadow>
        <boxGeometry args={[1.4,0.1,1.4]}/>
        <M c="black"/>
      </mesh>
      {/* Backrest */}
      <mesh position={[0,1.7,0.6]} castShadow>
        <boxGeometry args={[1.4,1.6,0.1]}/>
        <M c="black"/>
      </mesh>
      {/* Legs */}
      {([[-0.6,0.45,-0.6],[0.6,0.45,-0.6],[-0.6,0.45,0.6],[0.6,0.45,0.6]] as [number,number,number][]).map((p,i)=>(
        <mesh key={i} position={p} castShadow>
          <boxGeometry args={[0.08,0.9,0.08]}/>
          <M c="silver"/>
        </mesh>
      ))}
    </group>
  );
}

/* ─── Laptop ─────────────────────────────────────────────── */
export function Laptop({ onOpen }: { onOpen: ()=>void }) {
  const ref = useRef<THREE.Group>(null);
  const [hov, setHov] = useState(false);
  const baseY = useRef(0);
  useFrame(()=>{
    if(ref.current) ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, hov?0.1:0, 0.1);
  });
  const click = (e:ThreeEvent<MouseEvent>)=>{ e.stopPropagation(); onOpen(); };
  const enter = (e:ThreeEvent<PointerEvent>)=>{ e.stopPropagation(); setHov(true); document.body.style.cursor='pointer'; };
  const leave = ()=>{ setHov(false); document.body.style.cursor='default'; };
  return (
    // Desk world y = -0.5, top surface at y=-0.5+0.06=−0.44 → laptop base at −0.44+0.025=−0.415
    <group ref={ref} position={[-1,-0.415,-2.6]} onClick={click} onPointerEnter={enter} onPointerLeave={leave}>
      {/* Base */}
      <mesh castShadow>
        <boxGeometry args={[1.8,0.05,1.2]}/>
        <meshStandardMaterial color={hov?'#bdbdbd':'#9e9e9e'} roughness={0.35} metalness={0.7}/>
      </mesh>
      {/* Screen (open ~110deg) */}
      <group position={[0,0.02,-0.6]} rotation={[-1.9,0,0]}>
        <mesh castShadow>
          <boxGeometry args={[1.8,1.15,0.04]}/>
          <meshStandardMaterial color="#9e9e9e" roughness={0.35} metalness={0.7}/>
        </mesh>
        {/* Display glow */}
        <mesh position={[0,0,0.025]}>
          <boxGeometry args={[1.68,1.02,0.001]}/>
          <meshStandardMaterial color="#0a1628" emissive={hov?'#0055aa':'#003366'} emissiveIntensity={hov?2:1.2} roughness={0.1}/>
        </mesh>
      </group>
      {/* Hover label */}
      {hov && (
        <Html position={[0,1.4,0]} center>
          <div className="font-jetbrains text-[0.6rem] tracking-[0.15em] px-2 py-1 rounded-md whitespace-nowrap" style={{background:'rgba(0,212,255,0.15)',border:'1px solid #00d4ff',color:'#00d4ff'}}>
            CLICK — PROJECTS
          </div>
        </Html>
      )}
    </group>
  );
}

/* ─── Headphones on Chair ────────────────────────────────── */
export function Headphones({ onOpen }: { onOpen: ()=>void }) {
  const [hov, setHov] = useState(false);
  const ref = useRef<THREE.Group>(null);
  useFrame(({clock})=>{
    if(ref.current) ref.current.rotation.z = Math.sin(clock.elapsedTime*0.8)*0.03;
  });
  const click=(e:ThreeEvent<MouseEvent>)=>{e.stopPropagation();onOpen();};
  const enter=(e:ThreeEvent<PointerEvent>)=>{e.stopPropagation();setHov(true);document.body.style.cursor='pointer';};
  const leave=()=>{setHov(false);document.body.style.cursor='default';};
  return (
    <group ref={ref} position={[-1,-0.2,1.05]} onClick={click} onPointerEnter={enter} onPointerLeave={leave}>
      {/* Band (arch) — 7 segments */}
      {Array.from({length:7},(_,i)=>{
        const a = (Math.PI*i)/6;
        return (
          <mesh key={i} position={[Math.sin(a)*0.38, Math.cos(a)*0.38, 0]} rotation={[0,0,a]}>
            <boxGeometry args={[0.06,0.14,0.08]}/>
            <meshStandardMaterial color={hov?'#9b59ff':'#6c3dbf'} roughness={0.4} metalness={0.5} emissive={hov?'#6c3dbf':'#2a0080'} emissiveIntensity={0.3}/>
          </mesh>
        );
      })}
      {/* Ear cups */}
      {[-0.38,0.38].map((x,i)=>(
        <mesh key={i} position={[x,-0.05,0]} castShadow>
          <cylinderGeometry args={[0.18,0.18,0.1,16]}/>
          <meshStandardMaterial color={hov?'#7b4fcf':'#4a2a8f'} roughness={0.3} metalness={0.5}/>
        </mesh>
      ))}
      {/* Cushions */}
      {[-0.38,0.38].map((x,i)=>(
        <mesh key={i} position={[x,-0.05,0.05]}>
          <cylinderGeometry args={[0.14,0.14,0.04,16]}/>
          <meshStandardMaterial color="#1a1a1a" roughness={0.8}/>
        </mesh>
      ))}
      {hov&&(
        <Html position={[0,0.7,0]} center>
          <div className="font-jetbrains text-[0.6rem] tracking-[0.15em] px-2 py-1 rounded-md whitespace-nowrap" style={{background:'rgba(155,89,255,0.15)',border:'1px solid #9b59ff',color:'#9b59ff'}}>
            CLICK — SPOTIFY
          </div>
        </Html>
      )}
    </group>
  );
}

/* ─── Chess Setup ────────────────────────────────────────── */
type PieceColor = 'w' | 'b';
type PieceType = 'K'|'Q'|'R'|'B'|'N'|'P';

function ChessPiece({ pos, color, type, isThinking }:{ pos:[number,number,number]; color:PieceColor; type:PieceType; isThinking?:boolean }) {
  const ref = useRef<THREE.Group>(null);
  const col = color==='w' ? '#ede0c4' : '#2a1a06';
  const heights:Record<PieceType,number> = {K:0.28,Q:0.25,R:0.18,B:0.22,N:0.20,P:0.14};
  const h = heights[type];
  useFrame(({clock})=>{ if(ref.current&&isThinking) ref.current.rotation.y=Math.sin(clock.elapsedTime*1.1)*0.4; });
  return (
    <group ref={ref} position={pos}>
      <mesh><cylinderGeometry args={[0.075,0.085,0.025,12]}/><meshStandardMaterial color={col} roughness={0.45} metalness={0.1}/></mesh>
      <mesh position={[0,h*0.25,0]}><cylinderGeometry args={[0.035,0.055,h*0.5,10]}/><meshStandardMaterial color={col} roughness={0.45} metalness={0.1}/></mesh>
      {type==='P' && <mesh position={[0,h*0.65,0]}><sphereGeometry args={[0.04,10,10]}/><meshStandardMaterial color={col} roughness={0.45} metalness={0.1}/></mesh>}
      {type==='R' && <mesh position={[0,h*0.7,0]}><cylinderGeometry args={[0.05,0.04,0.06,12]}/><meshStandardMaterial color={col} roughness={0.45}/></mesh>}
      {(type==='B'||type==='Q') && <mesh position={[0,h*0.7,0]}><sphereGeometry args={[0.045,10,10]}/><meshStandardMaterial color={col} roughness={0.4}/></mesh>}
      {type==='K' && <><mesh position={[0,h*0.75,0]}><boxGeometry args={[0.02,0.08,0.02]}/><meshStandardMaterial color={col} roughness={0.4}/></mesh><mesh position={[0,h*0.78,0]}><boxGeometry args={[0.06,0.02,0.02]}/><meshStandardMaterial color={col} roughness={0.4}/></mesh></>}
      {type==='N' && <><mesh position={[0,h*0.7,0]}><boxGeometry args={[0.08,0.1,0.055]}/><meshStandardMaterial color={col} roughness={0.4}/></mesh><mesh position={[0.02,h*0.82,0]}><boxGeometry args={[0.05,0.05,0.04]}/><meshStandardMaterial color={col} roughness={0.4}/></mesh></>}
      {isThinking&&(<Html position={[0,0.48,0]} center><div style={{fontSize:16,userSelect:'none',pointerEvents:'none',lineHeight:1}}>💭</div></Html>)}
    </group>
  );
}

export function ChessSetup({ onOpen }: { onOpen:()=>void }) {
  const [hov,setHov]=useState(false);
  const click=(e:ThreeEvent<MouseEvent>)=>{e.stopPropagation();onOpen();};
  const enter=(e:ThreeEvent<PointerEvent>)=>{e.stopPropagation();setHov(true);document.body.style.cursor='pointer';};
  const leave=()=>{setHov(false);document.body.style.cursor='default';};
  const sq = 0.105;
  const squares = [];
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    squares.push(<mesh key={`${r}${c}`} position={[(c-3.5)*sq,0.05,(r-3.5)*sq]}><boxGeometry args={[sq-0.002,0.012,sq-0.002]}/><meshStandardMaterial color={(r+c)%2===0?'#f0d9b5':'#b58863'} roughness={0.65}/></mesh>);
  }
  // Mid-game piece layout — enough to look populated
  const pieces:[number,number,PieceColor,PieceType,boolean?][] = [
    [0,0,'w','R'],[1,0,'w','N'],[5,0,'w','B'],[4,0,'w','K'],[3,0,'w','Q'],
    [0,1,'w','P'],[1,1,'w','P'],[2,1,'w','P'],[4,1,'w','P'],[6,1,'w','P'],[7,1,'w','P'],
    [3,2,'w','P'],[5,2,'w','B'],[6,2,'w','N'],
    [0,7,'b','R'],[2,7,'b','B'],[4,7,'b','K'],[3,7,'b','Q'],[7,7,'b','R'],
    [0,6,'b','P'],[1,6,'b','P'],[4,6,'b','P'],[5,6,'b','P'],[7,6,'b','P'],
    [2,5,'b','N',true],[3,5,'b','P'],[5,5,'b','B'],
  ];

  return (
    <group position={[3.2,-1.2,-2.5]} onClick={click} onPointerEnter={enter} onPointerLeave={leave}>
      <mesh position={[0,-0.04,0]} castShadow><cylinderGeometry args={[0.58,0.58,0.08,20]}/><meshStandardMaterial color="#5c3310" roughness={0.8}/></mesh>
      {([0,1,2,3] as number[]).map(i=>{ const a=(Math.PI*2*i)/4; return(<mesh key={i} position={[Math.sin(a)*0.44,-0.52,Math.cos(a)*0.44]} castShadow><cylinderGeometry args={[0.03,0.03,1.0,8]}/><meshStandardMaterial color="#4a2c0e" roughness={0.85}/></mesh>); })}
      <group position={[0,0.04,0]}>
        <mesh><boxGeometry args={[0.92,0.04,0.92]}/><meshStandardMaterial color="#5c3310" roughness={0.75}/></mesh>
        {squares}
        {pieces.map(([c,r,col,type,think],i)=>(
          <ChessPiece key={i} pos={[(c-3.5)*sq, 0.06, (r-3.5)*sq]} color={col} type={type} isThinking={think}/>
        ))}
      </group>
      {/* Captured pieces thinking together */}
      <ChessPiece pos={[-0.78,0.05,0.28]} color="b" type="N" isThinking/>
      <ChessPiece pos={[-0.78,0.05,-0.25]} color="w" type="Q"/>
      {hov&&(
        <Html position={[0,0.9,0]} center>
          <div className="font-jetbrains text-[0.6rem] tracking-[0.15em] px-2 py-1 rounded-md whitespace-nowrap" style={{background:'rgba(0,255,204,0.12)',border:'1px solid #00ffcc',color:'#00ffcc'}}>
            CLICK — CHESS STATS
          </div>
        </Html>
      )}
    </group>
  );
}

/* ─── Books ──────────────────────────────────────────────── */
export function Books({ onOpen }: { onOpen:()=>void }) {
  const [hov,setHov]=useState(false);
  const click=(e:ThreeEvent<MouseEvent>)=>{e.stopPropagation();onOpen();};
  const enter=(e:ThreeEvent<PointerEvent>)=>{e.stopPropagation();setHov(true);document.body.style.cursor='pointer';};
  const leave=()=>{setHov(false);document.body.style.cursor='default';};

  const bookData:[string,number,number,number,number,number][]=[
    ['red',   -6.5,1.55,-5.2, 0.28,0.32],
    ['blue',  -6.5,1.55,-4.9, 0.24,0.3 ],
    ['green', -6.5,1.55,-4.6, 0.26,0.34],
    ['red',   -6.5,1.55,-4.3, 0.2,0.28 ],
    // Desk books
    ['blue', 0.8,-0.4,-2.1, 0.35,0.04],
    ['green',0.8,-0.36,-2.1,0.35,0.04],
  ];

  return (
    <group onClick={click} onPointerEnter={enter} onPointerLeave={leave}>
      {bookData.map(([col,x,y,z,w,h],i)=>(
        <mesh key={i} position={[x,y,z]} rotation={[0,i<4?0:Math.PI/2,i<4?0.05*((i%2===0)?1:-1):0]} castShadow>
          <boxGeometry args={[0.05,h||0.3,w]}/>
          <meshStandardMaterial color={MAT[col as keyof typeof MAT]?.color||'#8b1a1a'} roughness={0.8} emissive={hov?(MAT[col as keyof typeof MAT]?.color||'#8b1a1a'):'#000'} emissiveIntensity={hov?0.2:0}/>
        </mesh>
      ))}
      {hov&&(
        <Html position={[-6.5,2.4,-4.8]} center>
          <div className="font-jetbrains text-[0.6rem] tracking-[0.15em] px-2 py-1 rounded-md whitespace-nowrap" style={{background:'rgba(255,60,172,0.12)',border:'1px solid #ff3cac',color:'#ff3cac'}}>
            CLICK — READING
          </div>
        </Html>
      )}
    </group>
  );
}

/* ─── Desk Lamp ──────────────────────────────────────────── */
export function DeskLamp() {
  return (
    <group position={[1.8,-0.41,-2.6]}>
      <mesh><cylinderGeometry args={[0.08,0.1,0.05,12]}/><M c="silver"/></mesh>
      <mesh position={[0,0.3,0]}><cylinderGeometry args={[0.025,0.025,0.6,8]}/><M c="silver"/></mesh>
      <mesh position={[0.15,0.6,0]} rotation={[0,0,-0.4]}><cylinderGeometry args={[0.025,0.025,0.25,8]}/><M c="silver"/></mesh>
      {/* Shade */}
      <mesh position={[0.22,0.55,0]} rotation={[0,0,1.2]}><coneGeometry args={[0.12,0.2,12,1,true]}/><M c="silver"/></mesh>
      {/* Bulb glow */}
      <mesh position={[0.22,0.5,0]}><sphereGeometry args={[0.04,8,8]}/><M c="lamp"/></mesh>
      <pointLight position={[0.22,0.5,0]} intensity={2} color="#f5c842" distance={3} castShadow/>
    </group>
  );
}

/* ─── Plant ──────────────────────────────────────────────── */
export function Plant() {
  return (
    <group position={[6.5,-2.2,-5]}>
      {/* Pot */}
      <mesh castShadow><cylinderGeometry args={[0.25,0.2,0.4,14]}/><meshStandardMaterial color="#c1440e" roughness={0.9}/></mesh>
      {/* Soil */}
      <mesh position={[0,0.2,0]}><cylinderGeometry args={[0.24,0.24,0.04,14]}/><meshStandardMaterial color="#2a1a0e" roughness={1}/></mesh>
      {/* Stem */}
      <mesh position={[0,0.65,0]}><cylinderGeometry args={[0.03,0.04,0.9,8]}/><M c="green"/></mesh>
      {/* Leaves */}
      {[[0.3,1.0,0],[-.3,0.8,0],[0.2,1.2,0.2],[-.2,0.9,-0.2]].map((p,i)=>(
        <mesh key={i} position={p as [number,number,number]} rotation={[0,i*1.2,0.5]}>
          <sphereGeometry args={[0.22,8,6]}/>
          <meshStandardMaterial color={i%2===0?'#2d7a27':'#1e5c1a'} roughness={0.8}/>
        </mesh>
      ))}
    </group>
  );
}

/* ─── Ceiling Light ──────────────────────────────────────── */
export function CeilingLight() {
  return (
    <group position={[0,4.4,0]}>
      <mesh><boxGeometry args={[1.2,0.08,0.5]}/><meshStandardMaterial color="#c8c8c8" roughness={0.3} metalness={0.6}/></mesh>
      <mesh position={[0,-0.06,0]}><boxGeometry args={[1.0,0.04,0.4]}/><meshStandardMaterial color="#fffde7" emissive="#fffde7" emissiveIntensity={2.5} roughness={0.1}/></mesh>
      <pointLight position={[0,-0.5,0]} intensity={4} color="#fff5e0" distance={12} castShadow/>
    </group>
  );
}
