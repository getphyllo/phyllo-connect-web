import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react';
import { PhylloController, PHYLLO_FLOW_TYPES } from '../controller/phyllo'

const Home: NextPage = () => {

  const [workPlatforms, setWorkPlatforms] = useState([]);

  const phylloController = new PhylloController();


  const fetchWorkPlatforms = () => {
    phylloController.fetchWorkPlatforms().then((r => {
      setWorkPlatforms(r.data);
    }));
  }


  const initializeAllWorkPlatforms = (workPlatformId: string = '') => {

    phylloController.initialize({
      flowType: document.querySelector('input[name="flow-type"]:checked')?.value,
      clientDisplayName: 'Jelly',
      workPlatformId: workPlatformId,
      userId: Math.random().toString()
    });
  }


  useEffect(() => {
    fetchWorkPlatforms();
  }, [])

  return (
    <div >
      <Head>
        <title>NextJs - Phyllo sample app</title>
        <meta name="description" content="Phyllo sample app in NextJs" />
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <link rel="icon" href="/favicon.ico" />
        <script type="text/javascript" src="https://cdn.getphyllo.com/connect/v2/phyllo-connect.js"></script>
      </Head>

      <div className="screen_box">
        <div className="top_navbar">
          <h2>Phyllo Sample App - NextJs</h2>
        </div>
        <div className="content_text_box">
          <div className="content_data">
            <div className="btn_group">
              <div>
                <label>Flow Type - </label>
                <input name="flow-type" type="radio" value={PHYLLO_FLOW_TYPES.POPUP} defaultChecked /> Pop-up {"   "}
                <input name="flow-type" type="radio" value={PHYLLO_FLOW_TYPES.REDIRECT} /> Redirect
              </div>
              <button onClick={() => initializeAllWorkPlatforms()}>Connect Platform Account(s)</button>
              {
                workPlatforms.map((workplatform: any) => {
                  return <button key={workplatform.id} onClick={() => initializeAllWorkPlatforms(workplatform.id)}><img className="platform-icon" src={workplatform.logo_url}></img> Connect to {workplatform.name}</button>
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
