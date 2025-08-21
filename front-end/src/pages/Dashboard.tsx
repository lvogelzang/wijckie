import { type FC } from "react"
import { useTranslation } from "react-i18next"
import styles from "./Dashboard.module.scss"

const Dashboard: FC = () => {
    const { t } = useTranslation()

    return (
        <div>
            <h1>{t("Dashboard.title")}</h1>
            <div className={styles.container}>
                <div className={styles.block} style={{ height: "200px", backgroundColor: "red" }}>
                    0
                </div>
                <div className={styles.block} style={{ height: "180px", backgroundColor: "green" }}>
                    1
                </div>
                <div className={styles.block} style={{ height: "150px", backgroundColor: "teal" }}>
                    2
                </div>
                <div className={styles.block} style={{ height: "130px", backgroundColor: "purple" }}>
                    3
                </div>
                <div className={styles.block} style={{ height: "130px", backgroundColor: "cyan" }}>
                    4
                </div>
                <div className={styles.block} style={{ height: "140px", backgroundColor: "orange" }}>
                    5
                </div>
                <div className={styles.block} style={{ height: "160px", backgroundColor: "pink" }}>
                    6
                </div>
                <div className={styles.block} style={{ height: "110px", backgroundColor: "blue" }}>
                    7
                </div>
                <div className={styles.block} style={{ height: "120px", backgroundColor: "gray" }}>
                    8
                </div>
                <div className={styles.block} style={{ height: "200px", backgroundColor: "red" }}>
                    9
                </div>
                <div className={styles.block} style={{ height: "180px", backgroundColor: "green" }}>
                    10
                </div>
                <div className={styles.block} style={{ height: "150px", backgroundColor: "teal" }}>
                    11
                </div>
                <div className={styles.block} style={{ height: "130px", backgroundColor: "purple" }}>
                    12
                </div>
                <div className={styles.block} style={{ height: "130px", backgroundColor: "cyan" }}>
                    13
                </div>
                <div className={styles.block} style={{ height: "140px", backgroundColor: "orange" }}>
                    14
                </div>
                <div className={styles.block} style={{ height: "160px", backgroundColor: "pink" }}>
                    15
                </div>
                <div className={styles.block} style={{ height: "110px", backgroundColor: "blue" }}>
                    16
                </div>
                <div className={styles.block} style={{ height: "120px", backgroundColor: "gray" }}>
                    17
                </div>
            </div>
        </div>
    )
}

export default Dashboard
