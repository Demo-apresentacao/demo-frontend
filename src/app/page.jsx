import styles from './page.module.css'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.left}>
					<h1>Sistema Administrativo</h1>
					<p>Gerencie sua aplicação de forma simples e eficiente.</p>

					<div className={styles.actions}>
						<Link href="/login" className={styles.primaryBtn}>
							Entrar
						</Link>

						<Link href="/register" className={styles.secondaryBtn}>
							Cadastrar
						</Link>
					</div>
				</div>

				<div className={styles.right}>
					<Image
						src="/images/home.jpeg"
						alt="Ilustração do sistema"
						width={500}
						height={600}
						className={styles.imgHome}
						priority
					/>
				</div>
			</div>
		</div>
	)
}
