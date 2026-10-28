import logo from '../../assets/logo-masspay.png'

interface LogoProps {
  className?: string
}

// A imagem tem bastante margem em branco; o object-cover recorta e mostra só a marca.
export function Logo({ className = 'h-14 w-40' }: LogoProps) {
  return <img src={logo} alt="MassPay" className={`select-none object-cover ${className}`} draggable={false} />
}
