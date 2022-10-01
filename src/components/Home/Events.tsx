import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './home.scss'

export function Events(){
	var pathname: string = "/";
    const usePathname = () => {
        const location = useLocation();
        if(location.pathname.split('/')[1].length > 0){
            pathname = location.pathname.split('/')[1];
        }else{
            pathname = "/"
        }
        
    }
    usePathname();
	let cad2Container = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		if(cad2Container.current !== null){
            let elementScriptCad2 = document.createElement('script');
            elementScriptCad2.type = 'text/javascript';
            elementScriptCad2.text = `Ads_BA_AD('CAD2')`;
            if(cad2Container.current !== null && cad2Container.current.hasChildNodes()){
                cad2Container.current.innerHTML = '';
            }
            if(cad2Container.current !== null && !cad2Container.current.hasChildNodes()){
                cad2Container.current.appendChild(elementScriptCad2);
            }
        }
	},[cad2Container, pathname])
		return (
			<section className="main-section overflow-hidden">
				<div className="container">
					<h2 className="section-heading font-weight-bold" id="tools-anchor">Termine</h2>
					<div className="row">

						<div className="section-left-part col-xl-9 col-lg-12">
							<div className="coming-soon-component w-md-100 events-section" style={{marginLeft: '-16px'}}>
								<span className="text-white fs-18px coming-soon-text w-100 d-flex justify-content-center ">Coming soon...</span>
							</div>
							<div className="content-wrapper height-100" calendar-section="true">
								<div className="content">
									<div className="d-flex">
										<div className="calendar-wrap">
											<div className="week-day-names">
												<div>MO</div>
												<div>DI</div>
												<div>MI</div>
												<div>DO</div>
												<div>FR</div>
												<div>SA</div>
												<div>SO</div>
											</div>
											<div className="week-row">
												<div className="week-day"><a>1</a></div>
												<div className="week-day"><a>2</a></div>
												<div className="week-day active"><a>3</a></div>
												<div className="week-day event"><a>4</a></div>
												<div className="week-day event"><a>5</a></div>
												<div className="week-day"><a>6</a></div>
												<div className="week-day"><a>7</a></div>
											</div>
											<div className="week-row">
												<div className="week-day event"><a>8</a></div>
												<div className="week-day event"><a>9</a></div>
												<div className="week-day"><a>10</a></div>
												<div className="week-day event"><a>11</a></div>
												<div className="week-day event"><a>12</a></div>
												<div className="week-day"><a>13</a></div>
												<div className="week-day"><a>14</a></div>
											</div>
											<div className="week-row">
												<div className="week-day"><a>15</a></div>
												<div className="week-day event"><a>16</a></div>
												<div className="week-day"><a>17</a></div>
												<div className="week-day"><a>18</a></div>
												<div className="week-day event"><a>19</a></div>
												<div className="week-day"><a>20</a></div>
												<div className="week-day"><a>21</a></div>
											</div>
											<div className="week-row">
												<div className="week-day"><a>22</a></div>
												<div className="week-day"><a>23</a></div>
												<div className="week-day event"><a>24</a></div>
												<div className="week-day"><a>25</a></div>
												<div className="week-day"><a>26</a></div>
												<div className="week-day"><a>27</a></div>
												<div className="week-day"><a>28</a></div>
											</div>
											<div className="week-row">
												<div className="week-day event"><a>29</a></div>
												<div className="week-day event"><a>30</a></div>
												<div className="week-day"><a>31</a></div>
												<div className="week-day"></div>
												<div className="week-day"></div>
												<div className="week-day"></div>
												<div className="week-day"></div>
											</div>
										</div>
										<div className="termine-info">
											<div className="heading">Termine von heute</div>
											<div className="termine-row">
												<span>WIRECARD</span>
												<span className="font-weight-bold">Quartalszahlen 4. Quartal/Jahresabschluss</span>
											</div>
											<div className="termine-row">
												<span>BALLARD PWR</span>
												<span className="font-weight-bold">Quartalszahlen 4. Quartal/Jahresabschluss</span>
											</div>
											<div className="termine-row">
												<span>VARTA AG O.N.</span>
												<span className="font-weight-bold">Quartalszahlen 4. Quartal/Jahresabschluss</span>
											</div>
											<div className="termine-row">
												<span>NEL ASA</span>
												<span className="font-weight-bold">Quartalszahlen 4. Quartal/Jahresabschluss</span>
											</div>
											<div className="button-row d-flex justify-content-between">
												<span className="more-to-view">+4 weitere</span>
												<button className="btn btn-primary">alle Termine...</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="section-right-part">
							<div className="content-wrapper banner-advert-wrapper height-100 width-300">
								{
									cad2Container &&
								<div id='Ads_BA_CAD2' ref={cad2Container}></div>
								}
							</div>
						</div>
						{/* <div className="section-right-part col-xl col-lg-12 d-none d-xl-block">
							<div className="content-wrapper height-100 banner-advert-wrapper">
								<div className="banner-advert-holder neg-margin"><img src="/static/img/banner-example.png" alt="" className="img-fluid" /></div>
								<div className="bottom-text d-flex justify-content-end">Werbung</div>
							</div>
						</div> */}

					</div>
				</div>
			</section>
		)
	}